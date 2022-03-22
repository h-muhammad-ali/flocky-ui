import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PatronCard = ({ name, rides, time }) => {
  return (
    <View style={styles?.container}>
      <Ionicons name="person-circle" size={80} color={"#5188E3"} />
      <View style={styles?.subContainer}>
        <View style={styles?.introContainer}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles?.rides}>
            <Ionicons name="car" size={32} color={"#5188E3"} />
            <Text style={styles.ridesText}>{rides}</Text>
          </View>
        </View>
        <View style={styles?.stats}>
          <View style={styles?.timeContainer}>
            <Ionicons name="time-outline" size={22} color={"#758580"} />
            <Text style={{marginStart: 5}}>{time}</Text>
          </View>
          {/* <View style={styles?.availableSeatsContainer}>
            {[...Array(availableSeats)]?.map((element, index) => (
              <Ionicons
                key={index}
                name="person-circle-outline"
                color={"#5188E3"}
                size={20}
              />
            ))}
          </View>
          <View style={styles?.availableSeatsText}>
            <Text>Available Seats</Text>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default PatronCard;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
    paddingStart: 5,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  rides: { flexDirection: "row", alignItems: "center" },
  stats: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  availableSeatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  availableSeatsText: { alignItems: "center", justifyContent: "center" },
  name: {
    fontFamily: "Kanit-Medium",
    fontSize: 16,
  },
  ridesText: {
    fontFamily: "Kanit-Light",
  },
});
