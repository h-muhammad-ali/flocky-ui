import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AdminUserCard = ({ name, email, isBlocked }) => {
  return (
    <View style={styles?.container}>
      <Ionicons name="person-circle" size={70} />
      <View style={styles?.subContainer}>
        <View>
          <Text style={styles?.name}>{name}</Text>
          <Text style={styles?.email}>{email}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name={isBlocked ? "add-circle-outline" : "remove-circle-outline"}
            color="#5188E3"
            size={30}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminUserCard;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 5,
    borderBottomWidth: 1,
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 20,
  },
  email: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 16,
    color: "#999595",
  },
});
