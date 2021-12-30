import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const VehicleDetails = ({ id }) => {
  const dummyVehicleDetails = [
    {
      id: 1,
      model: "CR-V",
      make: "Honda",
      plateNumber: "LXW 1234",
      color: "Red",
      year: "2017",
      type: "bike",
      name: "Honda CR-V",
    },
  ];
  const [vehicle, setVehicle] = useState(null);
  useEffect(() => {
    setVehicle(dummyVehicleDetails?.find((element) => element?.id === id));
  }, []);
  return (
    <>
      {vehicle ? (
        <View style={styles?.container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles?.titleText}>Vehicle Details</Text>
            {vehicle?.type === "car" ? (
              <Ionicons name="car-sport-sharp" size={24} color="black" />
            ) : (
              <FontAwesome5 name="motorcycle" size={24} color="black" />
            )}
          </View>
          <Text
            style={styles?.detailValue}
          >{`${vehicle?.color} ${vehicle?.name} ${vehicle?.year}`}</Text>
          <Text style={styles?.detailValue}>{`${vehicle?.plateNumber}`}</Text>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

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
    textDecorationLine: "underline",
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
