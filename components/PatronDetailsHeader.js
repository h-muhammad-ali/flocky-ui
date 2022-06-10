import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PatronDetailsHeader = ({
  name,
  rides,
  filledSeats,
  availableSeats,
  showSeats,
  imgURL,
}) => {
  return (
    <View style={styles?.container}>
      {imgURL ? (
        <Image source={{ uri: imgURL }} style={styles?.image} />
      ) : (
        <Ionicons name="person-circle" size={100} color={"#5188E3"} />
      )}
      <View style={styles?.semiContainer}>
        <Text style={styles?.name}>{name}</Text>
        <Text style={styles?.nunitoSemiBold}>Rides Completed: {rides}</Text>
        {showSeats ? (
          <View style={styles.stats}>
            {[...Array(filledSeats)]?.map((element, index) => (
              <Ionicons
                key={index}
                name="person-circle-outline"
                color={"#666666"}
                size={20}
              />
            ))}
            {[...Array(availableSeats)]?.map((element, index) => (
              <Ionicons
                key={index}
                name="person-circle-outline"
                color={"#5188E3"}
                size={20}
              />
            ))}
            <Text style={styles?.nunitoSemiBold}>
              {" "}
              {filledSeats}/{filledSeats + availableSeats} seats filled
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default PatronDetailsHeader;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  semiContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 24,
  },
  nunitoBold: {
    fontFamily: "NunitoSans-Bold",
  },
  nunitoSemiBold: {
    fontFamily: "NunitoSans-SemiBold",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
