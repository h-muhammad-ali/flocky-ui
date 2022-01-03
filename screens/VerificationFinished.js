import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Contants from "expo-constants";
import Button from "../components/Button";

const VerificationFinished = ({ navigation }) => {
  return (
    <View style={styles?.container}>
      <View style={styles?.line}></View>
      <View style={styles?.body}>
        <View style={styles?.textContainer}>
          <Text style={styles?.title}>Finished!</Text>
          <Text style={styles?.text}>
            We’ll review your application within 3-5 business days. Please
            monitor your email inbox for any updates on the verification status.
          </Text>
        </View>
        <View style={styles?.imageContainer}>
          <Image
            source={require("../assets/flocky-assets/finished.png")}
            style={styles?.image}
          />
        </View>

        <Button
          text="Exit"
          onPress={() => {
            navigation?.navigate("MainMenu");
          }}
        />
      </View>
    </View>
  );
};

export default VerificationFinished;

const styles = StyleSheet?.create({
  container: { flex: 1, marginTop: Contants?.statusBarHeight },
  body: { flex: 1, justifyContent: "space-evenly" },
  line: { borderColor: "#5188E3", borderWidth: 5 },
  textContainer: { marginHorizontal: 15, justifyContent: "center" },
  title: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 20,
    marginBottom: 20,
  },
  text: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 16,
    color: "#758580",
  },
  imageContainer: { justifyContent: "center", alignItems: "center" },
  image: { width: 300, height: 250 },
});
