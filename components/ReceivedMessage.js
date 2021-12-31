import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReceivedMessage = ({ text, time }) => {
  return (
    <View style={styles?.container}>
      <Ionicons name="person-circle" color={"#5188E3"} size={40} />
      <View>
        <Text style={styles?.text}>{text}</Text>
        <Text style={styles?.status}>{time}</Text>
      </View>
    </View>
  );
};

export default ReceivedMessage;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    marginStart: 10,
    marginVertical: 5,
    width: "70%",
  },
  text: {
    color: "white",
    backgroundColor: "#C4C4C4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
  },
  status: {
    fontSize: 10,
    color: "grey",
  },
});
