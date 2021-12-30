import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Constants from "expo-constants";
import Button from "../components/Button";

const RideRequested = () => (
  <View style={styles?.container}>
    <View style={styles?.imageContainer}>
      <Image
        source={require("../assets/flocky-assets/ride.png")}
        style={styles?.image}
      ></Image>
    </View>
    <View style={styles?.textContainer}>
      <Text style={styles?.text}>Your Ride has been confirmed.</Text>
      <Text style={styles?.text}>
        Chat with your <Text style={{ color: "#5188E3" }}>Patron</Text> and join
        them at the meeting point.
      </Text>
    </View>
    <View style={styles?.buttonFlex}>
      <Button text="Patron Details" />
    </View>
  </View>
);

export default RideRequested;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
    marginTop: Constants?.statusBarHeight,
  },
  imageContainer: { flex: 2, alignSelf: "center" },
  image: { width: 380, height: 400 },
  textContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    marginHorizontal: 20,
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 25,
    color: "#666666",
  },
  buttonFlex: { flex: 1, justifyContent: "center" },
});
