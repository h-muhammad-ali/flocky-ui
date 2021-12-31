import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Header from "../components/Header";
import PatronDetailsHeader from "../components/PatronDetailsHeader";
import TimeLine from "../components/TimeLine";
import DepartingDetails from "../components/DepartingDetails";
import VehicleDetails from "../components/VehicleDetails";
import Button from "../components/Button";
import Map from "../components/Map";
import { Ionicons } from "@expo/vector-icons";

const PatronDetails = ({ navigation, route }) => {
  const dummyPatronDetails = [
    {
      id: 1,
      name: "John Doe",
      rides: 47,
      availableSeats: 3,
      totalSeats: 4,
      departureTime: "8:00 PM",
      source: "Sanda, Lahore",
      destination: "PUCIT, Lahore",
      stopsCount: 2,
      stops: ["MAO College", "New Anarkali"],
      selectedVehicleID: 1,
    },
    {
      id: 2,
      name: "John Doe",
      rides: 17,
      availableSeats: 2,
      totalSeats: 4,
      departureTime: "8:00 PM",
      source: "Sanda, Lahore",
      destination: "PUCIT, Lahore",
      stopsCount: 2,
      stops: ["MAO College", "New Anarkali"],
      selectedVehicleID: 2,
    },
  ];
  const [patron, setPatron] = useState(null);
  useEffect(() => {
    const obj = dummyPatronDetails?.find(
      (element) => element?.id === route.params?.id
    );
    setPatron(obj);
  }, []);

  return (
    <View style={styles?.container}>
      <Header text="Ride Details" navigation={navigation} />
      {patron ? (
        <>
          <PatronDetailsHeader
            name={patron?.name}
            rides={patron?.rides}
            filledSeats={patron?.totalSeats - patron?.availableSeats}
            availableSeats={patron?.availableSeats}
          />

          <TimeLine
            source={patron?.source}
            destination={patron?.destination}
            stops={patron?.stops}
          />
          {route.params?.isBooked ? (
            <View style={styles?.departingContainer}>
              <DepartingDetails
                style={{ flex: 1 }}
                showDate={false}
                time={patron?.departureTime}
              />
              <TouchableOpacity style={styles?.liveLocationButton}>
                <Text style={styles?.liveLocationText}>See Live Location</Text>
                <Ionicons name="location" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <DepartingDetails showDate={true} time={patron?.departureTime} />
          )}
          <VehicleDetails id={patron?.selectedVehicleID} />
          <View style={{ flex: 2, marginHorizontal: 12 }}>
            <Map />
          </View>
          {route.params?.isBooked ? (
            <Button
              text="Message"
              onPress={() => {
                navigation?.navigate("Chat", { name: patron?.name });
              }}
            />
          ) : (
            <Button
              text="Request Ride"
              onPress={() => {
                navigation?.navigate("RideRequested");
              }}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default PatronDetails;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  departingContainer: { flexDirection: "row", justifyContent: "space-between" },
  liveLocationButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5188E3",
    marginVertical: 12,
    marginHorizontal: 15,
    borderRadius: 20,
  },
  liveLocationText: { color: "white", marginEnd: 5 },
});
