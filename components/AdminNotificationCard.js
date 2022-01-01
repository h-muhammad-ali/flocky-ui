import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AdminNotificationCard = ({ text }) => {
  return (
    <View style={styles?.container}>
      <Ionicons name="notifications-circle" size={18} />
      <Text style={styles?.notification}>{text}</Text>
    </View>
  );
};

export default AdminNotificationCard;

const styles = StyleSheet?.create({
  container: {
    backgroundColor: "#E5E5E5",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
  },
  notification: {
    fontFamily: "NunitoSans-SemiBold",
    paddingStart: 10,
  },
});
