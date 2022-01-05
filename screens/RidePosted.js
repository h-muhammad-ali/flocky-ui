import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Constants from "expo-constants";
import Button from "../components/Button";

const RidePosted = ({ navigation }) => (
  <View style={styles?.container}>
    <View style={styles?.imageContainer}>
      <Image
        source={require("../assets/flocky-assets/ride.png")}
        style={styles?.image}
      ></Image>
    </View>
    <View style={styles?.textContainer}>
      <Text style={styles?.text}>Your Ride has been posted.</Text>
      <Text style={styles?.text}>
        <Text style={{ color: "#5188E3" }}>Hitchers</Text> can now view and
        request your ride.
      </Text>
    </View>
    <View style={styles?.buttonFlex}>
      <Button
        text="Alright!"
        onPress={() => {
          navigation?.navigate("MatchingRidesPatron");
        }}
      />
    </View>
  </View>
);

export default RidePosted;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
    marginTop: Constants?.statusBarHeight,
    backgroundColor: "white",
  },
  imageContainer: { flex: 2, aspectRatio: 1 * 1, alignSelf: "center" },
  image: { resizeMode: "cover", width: "100%", height: "100%" },
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
