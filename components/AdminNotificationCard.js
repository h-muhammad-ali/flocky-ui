import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AdminNotificationCard = ({ text, userID }) => {
  return (
    <View style={styles?.container}>
      <Text style={styles?.notification}>{text}</Text>
      <View style={styles?.showDetailsButton}>
        <TouchableOpacity style={{ flexDirection: "row" }}>
          <Text style={styles?.showDetailsText}>Show Details</Text>
          <Ionicons name="arrow-forward" size={20} />
        </TouchableOpacity>
      </View>
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
  },
  notification: {
    fontFamily: "NunitoSans-SemiBold",
  },
  showDetailsText: {
    color: "#5188E3",
    marginEnd: 5,
  },
  showDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },
});
