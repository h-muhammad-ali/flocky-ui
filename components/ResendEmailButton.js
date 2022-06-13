import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const ResendEmailButton = ({
  resendHandler,
  activeResend,
  timeLeft,
  targetTime,
}) => {
  return (
    <View style={styles?.resendContainer}>
      <Text style={styles?.linkLabel}>Haven't received it? </Text>
      <TouchableOpacity onPress={resendHandler} disabled={!activeResend}>
        <Text style={[styles?.link, !activeResend && { opacity: 0.5 }]}>
          Resend!
        </Text>
      </TouchableOpacity>
      {!activeResend && (
        <Text style={styles?.linkLabel}>
          {" "}
          in {timeLeft || targetTime} second(s)
        </Text>
      )}
    </View>
  );
};

export default ResendEmailButton;

const styles = StyleSheet.create({
  resendContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },
  link: {
    fontFamily: "Kanit-Medium",
    fontSize: 15,
    textAlign: "center",
    color: "#5188E3",
  },
  linkLabel: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 15,
    textAlign: "center",
  },
});
