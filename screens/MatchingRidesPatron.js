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

LogBox.ignoreLogs(["Setting a timer"]);

const MatchingRidesPatron = ({ navigation }) => {
  const [error, setError] = useState("");
  const { jwt } = useSelector((state) => state?.currentUser);
  var decoded = jwt_decode(jwt);
  const patron_id = decoded?.user_id;
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
  const updateLocationOnFirebase = async (latitude, longitude) => {
    const locationObj = {
      latitude,
      longitude,
    };
    const docId = patron_id;
    const ref = doc(firestore, "live-coordinates", `${docId}`);
    await setDoc(ref, locationObj);
  };
  useEffect(() => {
    let unsubscribe;
    Location.requestForegroundPermissionsAsync().then((response) => {
      if (response?.status === "granted") {
        Location?.watchPositionAsync(
          {
            accuracy: Location?.Accuracy?.BestForNavigation,
            timeInterval: 2000,
          },
          (location_update) => {
            const { latitude, longitude } = location_update?.coords;
            console?.log("INIT");
            updateLocationOnFirebase(latitude, longitude);
          }
        )
          .then((unsub) => {
            unsubscribe = unsub;
          })
          .catch((error) => {
            console?.log(error?.message);
          });
      } else {
        setError("Permission to access location was denied");
      }
    });

    return () => {
      unsubscribe?.remove();
    };
  }, []);

  return (
    <View style={styles?.container}>
      <Header
        text="Matching Rides"
        navigation={() => navigation?.goBack()}
        isCancel={true}
        onCancel={() => {
          
        }}
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
          errorHeader={"Error!"}
          errorDescription={error}
          clearError={() => {
            setError("");
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
