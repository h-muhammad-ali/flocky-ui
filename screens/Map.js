import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

const Map = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <MapView style={styles?.mapView} />
      <View style={styles?.heading}>
        <Header
          text="Select Custom Location"
          navigation={() => navigation?.navigate("SelectLocation")}
        />
      </View>
      <View style={styles.textView}>
        <Text>Location</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="checkmark-circle" size={80} color={"#5188E3"} />
      </TouchableOpacity>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  textView: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-start",
    height: 50,
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingStart: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 30,
  },
  button: {
    flex: 0,
    position: "absolute",
    right: 15,
    bottom: 15,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    height: 80,
    width: 80,
  },
  heading: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
});
