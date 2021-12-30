import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Contants from "expo-constants";

const VerificationFinished = () => {
  return (
    <View style={styles?.container}>
      <View style={styles?.line}></View>
      <View style={styles?.textContainer}>
        <Text style={styles?.title}>Finished!</Text>
        <Text style={styles?.text}>
          We’ll review your application within 3-5 business days. Please monitor
          your email inbox for any updates on the verification status.
        </Text>
      </View>
      <View style={styles?.imageContainer}>
        <Image
          source={require("../assets/flocky-assets/finished.png")}
          style={styles?.image}
        />
      </View>
      <TouchableOpacity style={styles?.buttonFlex}>
        <Text style={styles?.exit}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerificationFinished;

const styles = StyleSheet?.create({
  container: { flex: 1, marginTop: Contants?.statusBarHeight },
  line: { borderColor: "#5188E3", borderWidth: 5 },
  textContainer: { flex: 1, marginHorizontal: 15, justifyContent: "center" },
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
  imageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 300, height: 250 },
  exit: {
    backgroundColor: "#5188E3",
    color: "white",
    textAlign: "center",
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonFlex: { flex: 1, justifyContent: "center" },
});
