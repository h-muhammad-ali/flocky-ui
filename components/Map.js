import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const Map = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapView style={styles?.mapView} />
      <TouchableOpacity style={styles?.fullScreen}>
        <Ionicons name="expand" size={25} />
      </TouchableOpacity>
    </View>
  );
};

export default Map;

const styles = StyleSheet?.create({
  mapView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  fullScreen: { position: "absolute", top: 15, left: 10 },
});
