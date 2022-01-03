import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RankCard = ({ name, ridesCount }) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Ionicons name="person-circle" size={50} />
        <Text>{name}</Text>
      </View>
      <View style={styles.ridesContainer}>
        <Ionicons name="disc" size={25} />
        <Text style={styles.rides}>{ridesCount}</Text>
      </View>
    </View>
  );
};

export default RankCard;

const styles = StyleSheet.create({
  container: {
    borderColor: "#5188E3",
    borderWidth: 3,
    marginHorizontal: 8,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  ridesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 10,
  },
  rides: {
    paddingStart: 5,
  },
});
