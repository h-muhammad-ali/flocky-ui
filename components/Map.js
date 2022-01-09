import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const Map = ({ navigation, latitude, longitude }) => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles?.mapView}
        region={{
          latitude: latitude ?? 30.3753,
          longitude: longitude ?? 69.3451,
          latitudeDelta: latitude ? 0.05 : 12,
          longitudeDelta: longitude ? 0.05 : 12,
        }}
      >
        {latitude && longitude ? (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title="Your Current Location"
          />
        ) : (
          <></>
        )}
      </MapView>
      <TouchableOpacity style={styles?.fullScreen} onPress={navigation}>
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
  fullScreen: { position: "absolute", top: 15, right: 10 },
});
