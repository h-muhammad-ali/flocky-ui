import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SentMessage = ({ text, time }) => {
  return (
    <View style={styles?.container}>
      <View>
        <Text style={styles?.text}>{text}</Text>
        <Text style={styles?.status}>{time}</Text>
      </View>
    </View>
  );
};

export default SentMessage;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row-reverse",
    marginStart: 10,
    marginVertical: 5,
    width: "70%",
    alignSelf: "flex-end",
  },
  text: {
    color: "white",
    backgroundColor: "#5188E3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  status: {
    alignSelf: "flex-end",
    fontSize: 10,
    color: "grey",
  },
});
