import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Header from "../components/Header";
import HitcherCard from "../components/HitcherCard";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import ErrorDialog from "../components/ErrorDialog";
import * as Location from "expo-location";
import { firestore } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import jwt_decode from "jwt-decode";
import { LogBox } from "react-native";
import * as TaskManager from "expo-task-manager";
import BackgroundPermissionModal from "../components/BackgroundPermissionModal";

let lat;
let long;
let patron_id;
LogBox.ignoreLogs(["Setting a timer"]);
const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_FOR_LIVE_LOCATION";

const MatchingRidesPatron = ({ navigation }) => {
  const [error, setError] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [requestGranted, setRequestGranted] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const { jwt } = useSelector((state) => state?.currentUser);
  var decoded = jwt_decode(jwt);
  patron_id = decoded?.user_id;
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
  const { source, destination } = useSelector((state) => state?.locations);
  useEffect(() => {
    if (!requestGranted && showPermissionModal && openSettings) {
      Location.requestBackgroundPermissionsAsync().then((response) => {
        if (response?.status === "granted") {
          setRequestGranted(true);
        } else {
          setError("Background Location Permission is not given.");
        }
        setShowPermissionModal(false);
        setOpenSettings(false);
      });
    } else if (requestGranted && !showPermissionModal && !openSettings) {
      startBackgroundUpdate();
    }
    return () => stopBackgroundUpdate();
  }, [requestGranted, showPermissionModal, openSettings]);

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
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tracking stopped");
    }
  };

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then((response) => {
      if (response?.status === "granted") {
        Location.getBackgroundPermissionsAsync().then((response) => {
          if (response?.status === "granted") {
            setRequestGranted(true);
          } else {
            setShowPermissionModal(true);
          }
        });
      } else {
        setError("Permission to access location was denied");
      }
    });
  }, []);

  return (
    <View style={styles?.container}>
      <Header
        text="Matching Rides"
        navigation={() => navigation?.goBack()}
        isCancel={true}
        onCancel={() => {}}
      />
      <Text style={styles?.text}>
        Source: {source && `${source?.formatted_address}`}
      </Text>
      <Text style={styles?.text}>
        Destination: {destination && `${destination?.formatted_address}`}
      </Text>
      <View style={styles?.hitchers}>
        <FlatList
          data={dummyHitchers}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <HitcherCard
              onPress={() => {
                navigation?.navigate("HitcherDetails", { id: item?.id });
              }}
            />
          )}
        />
      </View>
      <View>
        <Button text="Start Ride" onPress={() => {}} />
      </View>
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Warning!"}
          errorDescription={error}
          clearError={() => {
            setError("");
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
  const docId = patron_id;
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
