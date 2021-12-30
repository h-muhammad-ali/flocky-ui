import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Bookmark = ({ text }) => {
  return (
    <View style={styles?.container}>
      <Text style={styles?.text}>{text}</Text>
      <Ionicons name="bookmark" size={20} />
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#F4F0F0",
    borderColor: "#666666",
    marginHorizontal: 5,
  },
  text: {
    paddingRight: 10,
  },
});
