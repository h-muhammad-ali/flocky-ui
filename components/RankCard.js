import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RankCard = ({ name, ridesCount, imgURL }) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        {imgURL ? (
          <Image source={{ uri: imgURL }} style={styles?.image} />
        ) : (
          <Ionicons name="person-circle" size={50} />
        )}
        <Text style={styles.name}>{name}</Text>
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
    fontFamily: "Kanit-Light",
  },
  name: {
    fontFamily: "Kanit-Regular",
    color: "black",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginVertical: 7,
    marginHorizontal: 5,
  },
});
