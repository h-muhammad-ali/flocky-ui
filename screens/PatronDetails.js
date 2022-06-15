import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  AppState,
} from "react-native";
import Header from "../components/Header";
import PatronDetailsHeader from "../components/PatronDetailsHeader";
import TimeLine from "../components/TimeLine";
import DepartingDetails from "../components/DepartingDetails";
import VehicleDetails from "../components/VehicleDetails";
import Button from "../components/Button";
import Map from "../components/Map";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import ErrorDialog from "../components/ErrorDialog";
import * as Location from "expo-location";
import { firestore } from "../config/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import jwt_decode from "jwt-decode";
import { LogBox } from "react-native";
import * as TaskManager from "expo-task-manager";
import BackgroundPermissionModal from "../components/BackgroundPermissionModal";
import useMountedState from "../custom-hooks/useMountedState";
import { setRideID } from "../redux/ride/rideActions";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { clearRideID, clearRideStatus } from "../redux/ride/rideActions";
import { resetLocationState } from "../redux/locations/locationsActions";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { useFocusEffect } from "@react-navigation/native";

let lat;
let long;
let hitcher_id;
LogBox.ignoreLogs(["Setting a timer"]);
const LOCATION_TASK_NAME_HITCHER =
  "BACKGROUND_LOCATION_FOR_LIVE_LOCATION_HITCHER";
let apiCancelToken;

const PatronDetails = ({ navigation, route }) => {
  const { jwt } = useSelector((state) => state?.currentUser);
  let decoded = jwt_decode(jwt);
  hitcher_id = decoded?.user_id;
  const [loading, setLoading] = useState(false);
  const [stayOnPageError, setStayOnPageError] = useState("");
  const [goBackError, setGoBackError] = useState("");
  const [retryError, setRetryError] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [goBackConfirmation, setGoBackConfirmation] = useState(false);
  const [requestGranted, setRequestGranted] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [cancel, setCancel] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const { rideID } = useSelector((state) => state?.ride);
  const isMounted = useMountedState();
  const dispatch = useDispatch();
  const [patron, setPatron] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!goBackConfirmation) {
          checkRideStatus(() => setGoBackConfirmation(true));
          // setGoBackConfirmation(true);
          return true;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME_HITCHER
    );
    if (hasStarted && !isMounted()) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME_HITCHER);
      const docId = hitcher_id;
      await deleteDoc(doc(firestore, "live-coordinates", `${docId}`));
      console.log("Hitcher Location tracking stopped");
    }
  };

  const checkRideStatus = (set = null, func = null) => {
    if (appStateVisible === "active") {
      setLoading(true);
      axios
        .get(`${BASE_URL}/ride/hitcher/${hitcher_id}/${rideID}/status`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cancelToken: apiCancelToken?.token,
        })
        .then((response) => {
          const resp = response?.data;
          console.log(resp);
          if (resp?.status === "PC") {
            setGoBackError("This patron has cancelled the ride.");
          } else if (resp?.status === "F") {
            setGoBackError("This ride has been finished.");
          } else if (resp?.status === "P") {
            stopBackgroundUpdate();
            if (func === "LL")
              setStayOnPageError(
                "Ride is already in progress. Your Patron is with you already."
              );
            else {
              if (set !== null) set();
            }
          } else {
            if (set !== null) {
              set();
            }
          }
        })
        .catch((error) => {
          if (!connectionStatus) {
            setStayOnPageError("No Internet connection!");
          } else if (error?.response) {
            setStayOnPageError(`${error?.response?.data}.`);
          } else if (error?.request) {
            setStayOnPageError(
              "Server not reachable! Can't get your vehicles."
            );
          } else if (axios.isCancel(error)) {
            console.log(error?.message);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      apiCancelToken = axios.CancelToken.source();
      console.log("USE FOCUS EFFECT");
      checkRideStatus();
      return () =>
        apiCancelToken?.cancel(
          "API Request was cancelled because of component unmount."
        );
    }, [appStateVisible, connectionStatus])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
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
        LOCATION_TASK_NAME_HITCHER
      );
      if (!isTaskDefined) {
        console.log("Task is not defined");
        return;
      }
      Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME_HITCHER).then(
        (hasStarted) => {
          console?.log(hasStarted);
          if (hasStarted) {
            console.log("Already started");
            return;
          }
        }
      );
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME_HITCHER, {
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
        LOCATION_TASK_NAME_HITCHER
      );
      if (hasStarted && !isMounted()) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME_HITCHER);
        const docId = hitcher_id;
        await deleteDoc(doc(firestore, "live-coordinates", `${docId}`));
        console.log("Hitcher Location tracking stopped");
      }
    };
    if (rideID && !requestGranted && showPermissionModal && openSettings) {
      Location.requestBackgroundPermissionsAsync().then((response) => {
        if (response?.status === "granted") {
          if (isMounted()) setRequestGranted(true);
        } else {
          if (isMounted())
            setStayOnPageError("Background Location Permission is not given.");
        }
        if (isMounted()) {
          setShowPermissionModal(false);
          setOpenSettings(false);
        }
      });
    } else if (
      rideID &&
      requestGranted &&
      !showPermissionModal &&
      !openSettings
    ) {
      console.log(
        "PATRON DETAILS => USEEFFECT => BEFORE ASSIGNING ID: ",
        decoded?.user_id,
        hitcher_id
      );
      hitcher_id = decoded?.user_id;
      console.log(
        "PATRON DETAILS => USEEFFECT => AFTER ASSIGNING ID: ",
        decoded?.user_id,
        hitcher_id
      );
      startBackgroundUpdate();
    }
    return () => {
      stopBackgroundUpdate();
    };
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
        if (isMounted())
          stayOnPageError("Permission to access location was denied");
      }
    });
  }, [route, isMounted]);

  const formatAMPM = (date) => {
    var hours = date?.getHours();
    var minutes = date?.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var dateString = date?.toLocaleDateString("en-us");
    var strTime = dateString + " " + hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const fetchPatronDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/ride/hitcher/${rideID}/patron-details`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cancelToken: apiCancelToken?.token,
      })
      .then((response) => {
        const resp = response?.data;
        setPatron(resp);
      })
      .catch((error) => {
        if (!connectionStatus) {
          setRetryError("No Internet connection!");
        } else if (error?.response) {
          setRetryError(`${error?.response?.data}.`);
        } else if (error?.request) {
          setRetryError("Server not reachable! Can't get your vehicles.");
        } else if (axios.isCancel(error)) {
          console.log(error?.message);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    fetchPatronDetails();
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, []);

  const deleteRide = () => {
    setLoading(true);
    axios
      .delete(`${BASE_URL}/ride/hitcher/${rideID}/cancel`, {
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
          setStayOnPageError("No Internet connection!");
        } else if (error?.response) {
          setStayOnPageError(`${error?.response?.data}.`);
        } else if (error?.request) {
          setStayOnPageError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
        setCancel(false);
      });
  };

  // const checkRideStatus = useCallback(
  //   (set = null) => {
  //     if (appStateVisible === "active") {
  //       setLoading(true);
  //       axios
  //         .get(`${BASE_URL}/ride/hitcher/${rideID}/status`, {
  //           timeout: 5000,
  //           headers: {
  //             Authorization: `Bearer ${jwt}`,
  //           },
  //           cancelToken: apiCancelToken?.token,
  //         })
  //         .then((response) => {
  //           const resp = response?.data;
  //           console.log("FULL DATa", resp);
  //           if (resp?.status === "C" || resp?.status === "F") {
  //             setGoBackError("This ride has been ended!");
  //           } else {
  //             if (set !== null) {
  //               set();
  //             }
  //           }
  //         })
  //         .catch((error) => {
  //           if (!connectionStatus) {
  //             setStayOnPageError("No Internet connection!");
  //           } else if (error?.response) {
  //             setStayOnPageError(
  //               `${error?.response?.data}.`
  //             );
  //           } else if (error?.request) {
  //             setStayOnPageError(
  //               "Server not reachable! Can't get your vehicles."
  //             );
  //           } else if (axios.isCancel(error)) {
  //             console.log(error?.message);
  //           } else {
  //             console.log(error);
  //           }
  //         })
  //         .finally(() => {
  //           setLoading(false);
  //         });
  //     }
  //   },
  //   [appStateVisible, connectionStatus]
  // );

  // useEffect(() => {
  //   checkRideStatus();
  // }, [checkRideStatus]);

  if (loading || !patron) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <View style={styles?.container}>
      <Header
        text="Ride Details"
        navigation={() => navigation?.goBack()}
        isCancel={rideID ? true : false}
        onCancel={() => checkRideStatus(() => setCancel(true))}
        isBackButtonVisible={rideID ? false : true}
      />
      <PatronDetailsHeader
        name={patron?.name}
        rides={patron?.ride_count}
        filledSeats={
          patron?.ride?.total_seats - patron?.ride?.available_seats || 0
        }
        availableSeats={patron?.ride?.available_seats || 0}
        showSeats={false}
        imgURL={patron?.profile_picture}
      />

      <TimeLine
        source={patron?.ride?.start_location?.formatted_address}
        destination={patron?.ride?.end_location?.formatted_address}
        stops={patron?.ride?.way_points?.map(
          (waypoint) => waypoint?.formatted_address
        )}
      />
      <View style={styles?.departingContainer}>
        <DepartingDetails
          style={{ flex: 1 }}
          showDate={false}
          time={formatAMPM(new Date(patron?.ride?.departure_time))}
        />
        <TouchableOpacity
          style={styles?.liveLocationButton}
          onPress={() => {
            if (connectionStatus) {
              checkRideStatus(() => {
                navigation?.navigate("Live Location", {
                  id: rideID,
                  name: patron?.name,
                });
              }, "LL");
            } else {
              setStayOnPageError("No Internet Connection!");
            }
          }}
        >
          <Text style={styles?.liveLocationText}>See Live Location</Text>
          <Ionicons name="location" size={20} />
        </TouchableOpacity>
      </View>

      <VehicleDetails
        make={patron?.vehicle?.make}
        model={patron?.vehicle?.model}
        registration_no={patron?.vehicle?.registration_no}
        type={patron?.vehicle?.type}
      />
      <View style={{ flex: 2, marginHorizontal: 12 }}>
        <Map
          start={{
            coords: {
              lat: patron?.ride?.start_location?.coordinates?.latitude,
              lng: patron?.ride?.start_location?.coordinates?.longitude,
            },
            formatted_address: patron?.start_location?.formatted_address,
            place_id: patron?.start_location?.place_id,
          }}
          end={{
            coords: {
              lat: patron?.ride?.end_location?.coordinates?.latitude,
              lng: patron?.ride?.end_location?.coordinates?.longitude,
            },
            formatted_address: patron?.end_location?.formatted_address,
            place_id: patron?.end_location?.place_id,
          }}
          way_points={
            patron?.ride?.way_points === null
              ? []
              : patron?.ride?.way_points.map((waypoint) => ({
                  coords: {
                    lat: waypoint?.coordinates?.latitude,
                    lng: waypoint?.coordinates?.longitude,
                  },
                  formatted_address: waypoint?.formatted_address,
                  place_id: waypoint?.place_id,
                }))
          }
          overview_polyline={patron?.ride?.overview_polyline}
          navigation={() => {
            navigation?.navigate("Full Screen Map", {
              start: {
                coords: {
                  lat: patron?.ride?.start_location?.coordinates?.latitude,
                  lng: patron?.ride?.start_location?.coordinates?.longitude,
                },
                formatted_address: patron?.start_location?.formatted_address,
                place_id: patron?.start_location?.place_id,
              },
              end: {
                coords: {
                  lat: patron?.ride?.end_location?.coordinates?.latitude,
                  lng: patron?.ride?.end_location?.coordinates?.longitude,
                },
                formatted_address: patron?.end_location?.formatted_address,
                place_id: patron?.end_location?.place_id,
              },
              way_points:
                patron?.ride?.way_points === null
                  ? []
                  : patron?.ride?.way_points.map((waypoint) => ({
                      coords: {
                        lat: waypoint?.coordinates?.latitude,
                        lng: waypoint?.coordinates?.longitude,
                      },
                      formatted_address: waypoint?.formatted_address,
                      place_id: waypoint?.place_id,
                    })),
              overview_polyline: patron?.ride?.overview_polyline,
            });
          }}
        />
      </View>
      <Button
        text="Message"
        onPress={() => {
          if (connectionStatus) {
            checkRideStatus(() => {
              navigation?.navigate("Chat", {
                name: patron?.name,
                id: hitcher_id,
              });
            });
          } else {
            setStayOnPageError("No Internet Connection!");
          }
        }}
      />
      <View>
        <ErrorDialog
          visible={!!goBackError || !!stayOnPageError}
          errorHeader={"Error!"}
          errorDescription={!!goBackError ? goBackError : stayOnPageError}
          clearError={() => {
            if (!!goBackError) {
              dispatch(clearRideStatus());
              dispatch(clearRideID());
              // dispatch(resetLocationState());
            } else setStayOnPageError("");
          }}
        />
        <ErrorDialog
          visible={!!retryError}
          errorHeader={"Error!"}
          errorDescription={retryError}
          clearError={() => {
            setRetryError("");
            fetchPatronDetails();
          }}
          isRetry={true}
        />
      </View>
      <View>
        <BackgroundPermissionModal
          visible={showPermissionModal}
          forPatron={false}
          positiveHandler={() => {
            setOpenSettings(true);
          }}
          negativeHandler={() => {
            setShowPermissionModal(false);
          }}
        />
        <ConfirmationDialog
          visible={goBackConfirmation || cancel}
          heading={"Wait!"}
          body={
            cancel
              ? "Are you sure you want to cancel your ride?"
              : "Are you sure you want to quit? The ride will still stay in process, unless you cancel it."
          }
          positiveHandler={() => {
            if (cancel) deleteRide();
            if (goBackConfirmation) {
              setGoBackConfirmation(false);
              BackHandler.exitApp();
            }
          }}
          negativeHandler={() => {
            if (cancel) setCancel(false);
            if (goBackConfirmation) setGoBackConfirmation(false);
          }}
        />
      </View>
    </View>
  );
};

export default PatronDetails;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  departingContainer: { flexDirection: "row", justifyContent: "space-between" },
  liveLocationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5188E3",
    marginVertical: 12,
    marginHorizontal: 15,
    borderRadius: 20,
  },
  liveLocationText: { color: "white", marginEnd: 5 },
});

const updateLocationOnFirebase = async (latitude, longitude, docId) => {
  const locationObj = {
    latitude,
    longitude,
  };
  const ref = doc(firestore, "live-coordinates", `${docId}`);
  await setDoc(ref, locationObj);
};

TaskManager.defineTask(LOCATION_TASK_NAME_HITCHER, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("PATRON DETAILS => TASK DEFINED: ", hitcher_id);
  if (data && hitcher_id) {
    const { locations } = data;
    const location = locations[0];
    if (location) {
      lat = location?.coords?.latitude;
      long = location?.coords?.longitude;
      updateLocationOnFirebase(lat, long, hitcher_id);
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${
          location?.coords?.latitude
        },${location?.coords?.longitude}`
      );
    }
  }
});
