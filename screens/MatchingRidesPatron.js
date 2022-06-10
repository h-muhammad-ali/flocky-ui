import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  BackHandler,
  ActivityIndicator,
  AppState,
} from "react-native";
import Header from "../components/Header";
import HitcherCard from "../components/HitcherCard";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import ErrorDialog from "../components/ErrorDialog";
import * as Location from "expo-location";
import { firestore } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { LogBox } from "react-native";
import * as TaskManager from "expo-task-manager";
import BackgroundPermissionModal from "../components/BackgroundPermissionModal";
import useMountedState from "../custom-hooks/useMountedState";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {
  clearRideID,
  setRideInProgress,
  clearRideStatus,
} from "../redux/ride/rideActions";
import { resetLocationState } from "../redux/locations/locationsActions";
import { useFocusEffect } from "@react-navigation/native";
import EmptyFlatlistMessage from "../components/EmptyFlatlistMessage";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";

let lat;
let long;
let ride_id;
LogBox.ignoreLogs(["Setting a timer"]);
const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_FOR_LIVE_LOCATION";
let apiCancelToken;

const MatchingRidesPatron = ({ navigation }) => {
  const dummyHitchers = [
    {
      id: 1,
      name: "Suleman",
    },
    {
      id: 2,
      name: "Ahsan",
    },
  ];
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [hitchers, setHitchers] = useState([]); // useState([])
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [requestGranted, setRequestGranted] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [goBackConfirmation, setGoBackConfirmation] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [finish, setFinish] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const { rideID, rideStatus } = useSelector((state) => state?.ride);
  ride_id = rideID;
  const isMounted = useMountedState();
  const dispatch = useDispatch();
  const { source, destination } = useSelector((state) => state?.locations);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!goBackConfirmation) {
          setGoBackConfirmation(true);
          return true;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      apiCancelToken = axios.CancelToken.source();
      fetchMatchedHitchers(true);
      return () =>
        apiCancelToken?.cancel(
          "API Request was cancelled because of component unmount."
        );
    }, [connectionStatus, appStateVisible])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
    console.log(subscription);
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  useEffect(() => {
    const startBackgroundUpdate = async () => {
      const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
      if (!isTaskDefined) {
        console.log("Task is not defined");
        return;
      }
      Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then(
        (hasStarted) => {
          console?.log(hasStarted);
          if (hasStarted) {
            console.log("Already started");
            return;
          }
        }
      );
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Flocky",
          notificationBody: "Flocky is using your location in the background.",
          notificationColor: "#fff",
        },
      });
    };

    const stopBackgroundUpdate = async () => {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
      );
      if (hasStarted && !isMounted()) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log("Location tracking stopped");
      }
    };
    if (!requestGranted && showPermissionModal && openSettings) {
      Location.requestBackgroundPermissionsAsync().then((response) => {
        if (response?.status === "granted") {
          if (isMounted()) setRequestGranted(true);
        } else {
          if (isMounted())
            setError("Background Location Permission is not given.");
        }
        if (isMounted()) {
          setShowPermissionModal(false);
          setOpenSettings(false);
        }
      });
    } else if (requestGranted && !showPermissionModal && !openSettings) {
      startBackgroundUpdate();
    }
    return () => stopBackgroundUpdate();
  }, [requestGranted, showPermissionModal, openSettings, isMounted]);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then((response) => {
      if (response?.status === "granted") {
        Location.getBackgroundPermissionsAsync().then((response) => {
          if (response?.status === "granted") {
            if (isMounted()) setRequestGranted(true);
          } else {
            if (isMounted()) setShowPermissionModal(true);
          }
        });
      } else {
        if (isMounted()) setError("Permission to access location was denied");
      }
    });
  }, [isMounted]);

  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted && !isMounted()) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tracking stopped");
    }
  };

  //ride status can be P(in progress), M(matching), C(cancelled), F(finished)
  const changeRideStatus = (todo) => {
    setLoading(true);
    axios
      .put(`${BASE_URL}/ride/patron/${rideID}/${todo}`, null, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        if (todo === "start") {
          dispatch(setRideInProgress());
          stopBackgroundUpdate();
        } else {
          dispatch(clearRideStatus());
          dispatch(clearRideID());
          //dispatch(resetLocationState());
        }
      })
      .catch((error) => {
        console?.log(error);
        if (!connectionStatus) {
          setError("No Internet connection!");
        } else if (error?.response) {
          setError(
            `${error?.response?.data}. Status Code: ${error?.response?.status}`
          );
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
        setFinish(false);
      });
  };

  const deleteRide = () => {
    setLoading(true);
    axios
      .delete(`${BASE_URL}/ride/patron/${rideID}/cancel`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        dispatch(clearRideStatus());
        dispatch(clearRideID());
        //dispatch(resetLocationState());
      })
      .catch((error) => {
        console?.log(error);
        if (!connectionStatus) {
          setError("No Internet connection!");
        } else if (error?.response) {
          setError(
            `${error?.response?.data}. Status Code: ${error?.response?.status}`
          );
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
        setCancel(false);
      });
  };

  const fetchMatchedHitchers = (isLoading) => {
    if (connectionStatus && appStateVisible === "active") {
      if (isLoading) setLoading(true);
      else setFetching(true);
      axios
        .get(`${BASE_URL}/ride/patron/${rideID}/matched_hitchers`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cancelToken: apiCancelToken?.token,
        })
        .then((response) => {
          if (serverError) setServerError(false);
          const resp = response?.data;
          setHitchers(resp);
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            if (error?.response?.status !== 404) {
              setError(
                `${error?.response?.data}. Status Code: ${error?.response?.status}`
              );
              setServerError(false);
            } else {
              setHitchers([]);
            }
          } else if (error?.request) {
            if (connectionStatus) setServerError(true);
          } else if (axios.isCancel(error)) {
            console.log(error?.message);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          if (isLoading) setLoading(false);
          else setFetching(false);
        });
    }
  };
  // useEffect(() => {
  //   apiCancelToken = axios.CancelToken.source();
  //   fetchMatchedHitchers(true);
  //   return () =>
  //     apiCancelToken?.cancel(
  //       "API Request was cancelled because of component unmount."
  //     );
  // }, [fetchMatchedHitchers]);

  return (
    <View style={styles?.container}>
      <Header
        text="Matching Rides"
        navigation={() => {}}
        isCancel={rideStatus === "P" ? false : true}
        onCancel={() => {
          setCancel(true);
        }}
        isBackButtonVisible={false}
      />
      <Text style={styles?.text}>
        Source: {source && `${source?.formatted_address}`}
      </Text>
      <Text style={styles?.text}>
        Destination: {destination && `${destination?.formatted_address}`}
      </Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#5188E3" />
        </View>
      ) : (
        <>
          <View style={styles?.hitchers}>
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={hitchers}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <HitcherCard
                  name={item?.name}
                  onPress={() => {
                    navigation?.navigate("HitcherDetails", { id: item?.id });
                  }}
                />
              )}
              onRefresh={() => {
                fetchMatchedHitchers(false);
              }}
              showsVerticalScrollIndicator={false}
              refreshing={fetching}
              ListEmptyComponent={
                <EmptyFlatlistMessage
                  networkError={!connectionStatus}
                  serverError={serverError}
                  serverErrorHandler={() => {
                    fetchMatchedHitchers(true);
                  }}
                />
              }
            />
          </View>
          <View>
            <Button
              text={rideStatus === "P" ? "Finish Ride" : "Start Ride"}
              onPress={() => {
                if (hitchers.length === 0) {
                  setWarning(
                    "You can't go further alone! Wait for hitchers and keep refreshing the screen."
                  );
                } else {
                  if (rideStatus === "P") setFinish(true);
                  else changeRideStatus("start");
                }
              }}
            />
          </View>
        </>
      )}
      <View>
        <ErrorDialog
          visible={!!error || !!warning}
          errorHeader={!!error ? "Error!" : "Warning!"}
          errorDescription={!!error ? error : warning}
          clearError={() => {
            if (!!error) setError("");
            else setWarning("");
          }}
        />
      </View>
      <View>
        <BackgroundPermissionModal
          visible={showPermissionModal}
          forPatron={true}
          positiveHandler={() => {
            setOpenSettings(true);
          }}
          negativeHandler={() => {
            setShowPermissionModal(false);
          }}
        />
        <ConfirmationDialog
          visible={goBackConfirmation || cancel || finish}
          heading={"Wait!"}
          body={
            cancel
              ? "Are you sure you want to cancel your ride?"
              : finish
              ? "Are you sure you want to finish your ride?"
              : "Are you sure you want to quit? The ride will still stay in process, unless you cancel it."
          }
          positiveHandler={() => {
            if (cancel) deleteRide();
            if (goBackConfirmation) BackHandler.exitApp();
            if (finish) changeRideStatus("finish");
          }}
          negativeHandler={() => {
            if (cancel) setCancel(false);
            if (goBackConfirmation) setGoBackConfirmation(false);
            if (finish) setFinish(false);
          }}
        />
      </View>
    </View>
  );
};

export default MatchingRidesPatron;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  text: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: "200",
    fontFamily: "NunitoSans-Bold",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    paddingVertical: 5,
    color: "#758580",
    textAlignVertical: "center",
    minHeight: 50,
  },
  hitchers: {
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },
});

const updateLocationOnFirebase = async (latitude, longitude) => {
  const locationObj = {
    latitude,
    longitude,
  };
  const docId = ride_id;
  const ref = doc(firestore, "live-coordinates", `${docId}`);
  await setDoc(ref, locationObj);
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      lat = location?.coords?.latitude;
      long = location?.coords?.longitude;
      updateLocationOnFirebase(lat, long);
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${
          location?.coords?.latitude
        },${location?.coords?.longitude}`
      );
    }
  }
});
