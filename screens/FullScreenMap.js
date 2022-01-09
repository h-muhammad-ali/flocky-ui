import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const FullScreenMap = ({ route }) => {
  return (
    <View style={styles.container}>
      {console.log(route)}
      <MapView
        style={styles?.mapView}
        region={{
          latitude: route.params?.latitude ?? 30.3753,
          longitude: route.params?.longitude ?? 69.3451,
          latitudeDelta: route.params?.latitude ? 0.05 : 12,
          longitudeDelta: route.params?.longitude ? 0.05 : 12,
        }}
      >
        {route.params?.latitude && route.params?.longitude ? (
          <Marker
            coordinate={{
              latitude: route.params?.latitude,
              longitude: route.params?.longitude,
            }}
            title="Your Current Location"
          />
        ) : (
          <></>
        )}
      </MapView>
    </View>
  );
};

export default FullScreenMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
});
