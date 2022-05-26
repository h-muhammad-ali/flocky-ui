import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

const EmptyFlatlistMessage = ({
  networkError,
  serverError,
  serverErrorHandler,
}) => {
  return (
    <View style={styles?.container}>
      {networkError ? (
        <>
          <MaterialCommunityIcons
            name="network-strength-off"
            size={SCREEN_WIDTH / 1.8}
            color="grey"
          />
          <Text style={styles?.text}>No Network!</Text>
        </>
      ) : serverError ? (
        <>
          <MaterialCommunityIcons
            name="server-network-off"
            size={SCREEN_WIDTH / 1.8}
            color="grey"
          />
          <Text style={styles?.text}>Cannont Connect to the Server!</Text>

          <TouchableOpacity style={styles?.button} onPress={serverErrorHandler}>
            <Text style={styles?.buttonText}>Retry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Entypo name="dropbox" size={SCREEN_WIDTH / 1.8} color="grey" />
          <Text style={styles?.text}>Nothing to Show in List!</Text>
        </>
      )}
    </View>
  );
};

export default EmptyFlatlistMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "NunitoSans-Regular",
    fontSize: SCREEN_WIDTH / 18,
    color: "grey",
  },
  button: {
    backgroundColor: "#5188E3",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontFamily: "NunitoSans-Regular",
    fontSize: 18,
  },
});
