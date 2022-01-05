import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Map from "../components/Map";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import {
  setSource,
  setDestination,
  removeWayPoint,
  emptyWayPoints,
} from "../redux/locations/locationsActions";

const WhereTo = ({ navigation, route }) => {
  const CURRENT_LOCATION = "Current Location";
  const DESTINATION = "Company Location";
  const { source, destination, wayPoints } = useSelector(
    (state) => state?.locations
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSource(CURRENT_LOCATION));
    dispatch(setDestination(DESTINATION));
    dispatch(emptyWayPoints());
  }, []);
  return (
    <View style={styles?.container}>
      <Header text="Where to?" navigation={() => navigation?.goBack()} />
      <Text style={styles.label}>From</Text>
      <TextInput
        value={source}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("SelectLocation", { origin: "From" })
        }
        showSoftInputOnFocus={false}
      />
      {wayPoints?.length != 0 && <Text style={styles?.label}>Way-Points</Text>}
      {wayPoints?.map((value, index) => (
        <View
          key={index}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <TextInput
            value={"Way-Point " + ++index + ": " + value}
            style={[styles?.input, { flex: 0.9 }]}
            selectionColor={"#5188E3"}
            showSoftInputOnFocus={false}
          />
          <TouchableOpacity
            onPress={() => {
              dispatch(removeWayPoint(value));
            }}
          >
            <Ionicons name="close" size={30} />
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles?.label}>To</Text>
      <TextInput
        value={destination}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("SelectLocation", { origin: "To" })
        }
        showSoftInputOnFocus={false}
      />
      {route.params?.isPatron && wayPoints?.length < 2 ? (
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
        navigation={() => {
          navigation?.navigate("Full Screen Map");
        }}
      />
      <Button
        text={route.params?.isPatron ? "Continue" : "Find Matching Rides"}
        onPress={() => {
          !route.params?.isPatron
            ? navigation?.navigate("MatchingRidesHitcher")
            : navigation?.navigate("RideDetails");
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
    paddingStart: 10,
    marginBottom: 15,
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
