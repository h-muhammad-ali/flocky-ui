import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const Header = ({ text, navigation }) => {
  return (
    <View style={styles?.container}>
      <TouchableOpacity style={styles?.backArrow} onPress={navigation}>
        <Ionicons name="arrow-back-outline" size={30} />
      </TouchableOpacity>
      <View style={styles?.title}>
        <Text style={styles?.titleText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    marginTop: Constants.statusBarHeight,
    marginBottom: 20,
  },
  backArrow: {
    marginLeft: 10,
  },
  title: {
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  titleText: { marginRight: 40, fontFamily: "NunitoSans-Bold" },
});

export default Header;
