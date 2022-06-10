import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Constants from "expo-constants";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { clearRideID } from "../redux/ride/rideActions";

const RideRequested = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
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
          Chat with your <Text style={{ color: "#5188E3" }}>Patron</Text> and
          join them at the meeting point.
        </Text>
      </View>
      <View style={styles?.buttonFlex}>
        <Button
          text="Patron Details"
          onPress={() => {
            //dispatch(clearRideID());
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "PatronDetailsAfterRideConfirmed",
                  params: {
                    isBooked: true,
                  },
                },
              ],
            });
          }}
        />
      </View>
    </View>
  );
};

export default RideRequested;

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
