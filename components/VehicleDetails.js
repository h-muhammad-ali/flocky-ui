import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const VehicleDetails = ({ make, model, registration_no, type }) => (
  <View style={styles?.container}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles?.titleText}>Vehicle Details</Text>
      {type === "C" ? (
        <Ionicons name="car-sport-sharp" size={24} color="black" />
      ) : (
        <FontAwesome5 name="motorcycle" size={24} color="black" />
      )}
    </View>
    <Text style={styles?.detailValue}>{`${make} ${model}`}</Text>
    <Text style={styles?.detailValue}>{`${registration_no}`}</Text>
  </View>
);

export default VehicleDetails;

const styles = StyleSheet?.create({
  container: {
    backgroundColor: "#5188E3",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  detailContainer: { flex: 1, alignItems: "center" },
  detailTitle: {
    textAlign: "center",
    color: "white",
    textDecorationLine: "underline",
  },
  detailValue: {
    textAlign: "center",
    color: "white",
  },
});
