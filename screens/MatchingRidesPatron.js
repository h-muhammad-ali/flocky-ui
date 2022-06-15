import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  BackHandler,
  ActivityIndicator,
  AppState,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../components/Header";
import HitcherCard from "../components/HitcherCard";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import ErrorDialog from "../components/ErrorDialog";
import * as Location from "expo-location";
import { firestore } from "../config/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
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
import { useFocusEffect } from "@react-navigation/native";
import EmptyFlatlistMessage from "../components/EmptyFlatlistMessage";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import * as Linking from "expo-linking";

let lat;
let long;
let ride_id;
LogBox.ignoreLogs(["Setting a timer"]);
const LOCATION_TASK_NAME_PATRON =
  "BACKGROUND_LOCATION_FOR_LIVE_LOCATION_PATRON";
let apiCancelToken;

const MatchingRidesPatron = ({ navigation }) => {
  const { rideID, rideStatus } = useSelector((state) => state?.ride);
  ride_id = rideID;
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [hitchers, setHitchers] = useState([]); // useState([])
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [requestGranted, setRequestGranted] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [goBackConfirmation, setGoBackConfirmation] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [finish, setFinish] = useState(false);
  const [mapIcon, showMapIcon] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const isMounted = useMountedState();
  const dispatch = useDispatch();
  const { source, destination, wayPoints } = useSelector(
    (state) => state?.locations
  );

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
      const isTaskDefined = TaskManager.isTaskDefined(
        LOCATION_TASK_NAME_PATRON
      );
      if (!isTaskDefined) {
        console.log("Task is not defined");
        return;
      }
      Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME_PATRON).then(
        (hasStarted) => {
          console?.log(hasStarted);
          if (hasStarted) {
            console.log("Already started");
            return;
          }
        }
      );
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME_PATRON, {
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
        LOCATION_TASK_NAME_PATRON
      );
      if (hasStarted && !isMounted()) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME_PATRON);
        const docId = ride_id;
        await deleteDoc(doc(firestore, "live-coordinates", `${docId}`));
        console.log("Patron Location tracking stopped");
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
      console.log(
        "MATCHING RIDE HITCHER => USEEFFECT => BEFORE ASSIGNING ID: ",
        rideID,
        ride_id
      );
      ride_id = rideID;
      console.log(
        "MATCHING RIDE HITCHER => USEEFFECT => AFTER ASSIGNING ID: ",
        rideID,
        ride_id
      );
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
      LOCATION_TASK_NAME_PATRON
    );
    if (hasStarted && !isMounted()) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME_PATRON);
      const docId = ride_id;
      await deleteDoc(doc(firestore, "live-coordinates", `${docId}`));
      console.log("Patron Location tracking stopped");
    }
  };

  //ride status can be P(in progress), M(matching), C(cancelled), F(finished)
  const changeRideStatus = (todo) => {
    setFullScreenLoading(true);
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
          showMapIcon(true);
        } else {
          dispatch(clearRideStatus());
          dispatch(clearRideID());
        }
      })
      .catch((error) => {
        console?.log(error);
        if (!connectionStatus) {
          setError("No Internet connection!");
        } else if (error?.response) {
          setError(
            `${error?.response?.data}.`
          );
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setFullScreenLoading(false);
        setFinish(false);
      });
  };

  const deleteRide = () => {
    setFullScreenLoading(true);
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
      })
      .catch((error) => {
        console?.log(error);
        if (!connectionStatus) {
          setError("No Internet connection!");
        } else if (error?.response) {
          setError(
            `${error?.response?.data}.`
          );
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setFullScreenLoading(false);
        setCancel(false);
      });
  };

  const openMap = () => {
    const link = `https://www.google.com/maps/dir/?api=1&origin=${
      source?.formatted_address
    }&origin_place_id=${source?.place_id}&destination=${
      destination?.formatted_address
    }&destination_place_id=${
      destination?.place_id
    }&travelmode=driving&waypoints=${
      wayPoints?.length === 0
        ? ""
        : wayPoints?.map((waypoint) => waypoint?.formatted_address)?.join("|")
    }&waypoint_place_ids=${
      wayPoints?.length === 0
        ? ""
        : wayPoints?.map((waypoint) => waypoint?.place_id)?.join("|")
    }`;
    Linking.openURL(link);
  };

  const fetchMatchedHitchers = (isLoading) => {
    if (connectionStatus && appStateVisible === "active") {
      if (cancel) setCancel(false);
      if (finish) setFinish(false);
      if (goBackConfirmation) setGoBackConfirmation(false);
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
                `${error?.response?.data}.`
              );
            } else {
              setHitchers([]);
            }
            setServerError(false);
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

  if (fullScreenLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
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
      {mapIcon ? (
        <>
          <TouchableOpacity
            style={styles?.mapButtonContainer}
            onPress={() => openMap()}
          >
            <Text style={styles?.mapButtonText}>Open Google Maps</Text>
            <Image
              source={require("../assets/flocky-assets/google-maps.png")}
              style={styles?.image}
            />
          </TouchableOpacity>
        </>
      ) : (
        <></>
      )}
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
                if (hitchers.length === 0 && rideStatus !== "P") {
                  setWarning(
                    "You can't go further alone! Wait for hitchers and keep refreshing the screen."
                  );
                } else {
                  if (rideStatus === "P") {
                    setFinish(true);
                  } else changeRideStatus("start");
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
  image: { width: 30, height: 30, borderRadius: 15 },
  mapButtonText: {
    textAlignVertical: "center",
    marginHorizontal: 10,
    fontFamily: "NunitoSans-SemiBold",
  },
  mapButtonContainer: {
    flexDirection: "row",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#5188E3",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
});

const updateLocationOnFirebase = async (latitude, longitude, docId) => {
  const locationObj = {
    latitude,
    longitude,
  };
  const ref = doc(firestore, "live-coordinates", `${docId}`);
  await setDoc(ref, locationObj);
};

TaskManager.defineTask(LOCATION_TASK_NAME_PATRON, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("MATCHING RIDE HITCHER => DEFINE TASK: ", ride_id);
  if (data && ride_id) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      lat = location?.coords?.latitude;
      long = location?.coords?.longitude;
      updateLocationOnFirebase(lat, long, ride_id);
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${
          location?.coords?.latitude
        },${location?.coords?.longitude}`
      );
    }
  }
});
