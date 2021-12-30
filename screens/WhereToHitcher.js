import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const WhereToHitcher = ({ navigation, route }) => {
  const CURRENT_LOCATION = "Current Location";
  const DESTINATION = "Company Location";

  const [wayPoints, setWayPoints] = useState([]);
  return (
    <View style={styles?.container}>
      {route.params?.stop &&
        !wayPoints?.some((item) => item === route.params?.stop) &&
        setWayPoints((prevState) => [...prevState, route.params?.stop])}
      <Header text="Where to?" navigation={navigation} />
      <Text style={styles.label}>From</Text>
      <TextInput
        value={route.params?.source ?? CURRENT_LOCATION}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("HitcherSource", { origin: "From" })
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
              setWayPoints((prevState) =>
                prevState?.filter((element, i) => i === index)
              );
            }}
          >
            <Ionicons name="close" size={30} />
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles?.label}>To</Text>
      <TextInput
        value={route.params?.destination ?? DESTINATION}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("HitcherSource", { origin: "To" })
        }
        showSoftInputOnFocus={false}
      />
      {route.params?.isPatron && wayPoints?.length < 2 ? (
        <TouchableOpacity
          style={styles?.waypoint}
          onPress={() => {
            navigation?.navigate("HitcherSource", { origin: "Stop" });
          }}
        >
          <Text style={styles?.waypointText}>Add Way-Points</Text>
          <Ionicons name="add-circle-outline" color={"white"} size={20} />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <MapView style={styles?.mapView} />
      <TouchableOpacity
        style={styles?.continue}
        onPress={() => {
          navigation?.navigate("MatchingRidesHitcher", {
            source: route.params?.source,
            destination: route.params?.destination,
          });
        }}
      >
        <Text style={styles?.continueText}>Find Matching Rides</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WhereToHitcher;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
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
  continue: {
    backgroundColor: "#5188E3",
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  continueText: { color: "white", textAlign: "center" },
  fullScreen: { position: "absolute", top: 350, left: 10 },
  mapView: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
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
