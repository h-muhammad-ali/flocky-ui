import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Button = ({ text, onPress, isDisabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles?.button, isDisabled && { opacity: 0.5 }]}
      disabled={isDisabled}
    >
      <Text style={styles?.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet?.create({
  text: { color: "white", textAlign: "center", fontFamily: "NunitoSans-Bold" },
  button: {
    backgroundColor: "#5188E3",
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 20,
  },
});
