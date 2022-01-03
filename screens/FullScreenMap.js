import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

const FullScreenMap = () => {
  return (
    <View style={styles.container}>
      <MapView style={styles?.mapView} />
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
