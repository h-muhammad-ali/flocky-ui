import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Map from "../components/Map";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import {
  setSource,
  emptyDestination,
  removeWayPoint,
  emptyWayPoints,
} from "../redux/locations/locationsActions";
import * as Location from "expo-location";

const WhereTo = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const CURRENT_LOCATION = "Current Location";
  const { source, destination, wayPoints } = useSelector(
    (state) => state?.locations
  );

  const dispatch = useDispatch();
  const ref = useRef(null);
  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then((response) => {
        if (response?.status === "granted") {
          Location.getCurrentPositionAsync({})
            .then((response) => {
              setLocation(response);
              dispatch(
                setSource({
                  latitude: response?.coords?.latitude,
                  longitude: response?.coords?.longitude,
                })
              );
            })
            .catch((error) => {
              Alert?.alert(error?.message);
            });
        } else {
          setErrorMsg("Permission to access location was denied");
          dispatch(setSource(CURRENT_LOCATION));
        }
      })
      .catch((error) => {
        Alert?.alert(error?.message);
      });
    dispatch(emptyDestination());
    dispatch(emptyWayPoints());
  }, []);

  useEffect(() => {
    if (destination !== "" && ref?.current) {
      ref?.current?.setNativeProps({
        borderColor: "#B7B7B7",
      });
    }
  }, [destination]);

  return (
    <View style={styles?.container}>
      <Header text="Where to?" navigation={() => navigation?.goBack()} />
      <Text style={styles.label}>From</Text>
      <TextInput
        value={
          location
            ? typeof source === "object"
              ? `${source?.latitude} °N ${source?.longitude} °E`
              : source
            : errorMsg ?? "Loading..."
        }
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("SelectLocation", { origin: "From" })
        }
        showSoftInputOnFocus={false}
      />
      {wayPoints?.length != 0 && <Text style={styles?.label}>Way-Points</Text>}
      {route.params?.isPatron && wayPoints?.length != 0 ? (
        <FlatList
          style={{ flexGrow: 0, height: 60 }}
          data={wayPoints}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={[styles?.input, { flex: 0.9 }]}>
                {"Way-Point " + ++index + ": " + item}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(removeWayPoint(item));
                }}
              >
                <Ionicons name="close" size={25} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <></>
      )}
      <Text style={styles?.label}>To</Text>
      <TextInput
        ref={ref}
        value={destination}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("SelectLocation", { origin: "To" })
        }
        showSoftInputOnFocus={false}
      />
      {route.params?.isPatron && wayPoints?.length < 10 ? (
        <TouchableOpacity
          style={styles?.waypoint}
          onPress={() => {
            navigation?.navigate("SelectLocation", { origin: "Stop" });
          }}
        >
          <Text style={styles?.waypointText}>Add Way-Points</Text>
          <Ionicons name="add-circle-outline" color={"white"} size={20} />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <Map
        latitude={source?.latitude}
        longitude={source?.longitude}
        navigation={() => {
          navigation?.navigate("Full Screen Map", {
            latitude: source?.latitude,
            longitude: source?.longitude,
          });
        }}
      />
      <Button
        text={route.params?.isPatron ? "Continue" : "Find Matching Rides"}
        onPress={() => {
          if (destination === "" && ref.current) {
            ref.current.setNativeProps({
              borderColor: "red",
            });
          } else {
            !route.params?.isPatron
              ? navigation?.navigate("MatchingRidesHitcher")
              : navigation?.navigate("RideDetails");
          }
        }}
      />
    </View>
  );
};

export default WhereTo;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    fontFamily: "NunitoSans-SemiBold",
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlignVertical: "center",
  },
  waypoint: {
    backgroundColor: "#5188E3",
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 10,
    paddingStart: 10,
  },
  waypointText: {
    color: "white",
  },
});
