import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import RankCard from "../components/RankCard";

const WallOfHonor = ({ navigation }) => {
  const dummyScoreCard = [
    {
      id: 4,
      name: "John Doe",
      rides: 105,
    },
    {
      id: 5,
      name: "John Doe",
      rides: 101,
    },
    {
      id: 6,
      name: "John Doe",
      rides: 97,
    },
    {
      id: 7,
      name: "John Doe",
      rides: 90,
    },
    {
      id: 8,
      name: "John Doe",
      rides: 83,
    },
    {
      id: 9,
      name: "John Doe",
      rides: 74,
    },
    {
      id: 10,
      name: "John Doe",
      rides: 66,
    },
  ];
  const dummyTopThree = [
    {
      id: 1,
      name: "John Doe",
      rides: 123,
    },
    {
      id: 2,
      name: "John Doe",
      rides: 116,
    },
    {
      id: 3,
      name: "John Doe",
      rides: 110,
    },
  ];
  return (
    <View style={styles?.container}>
      <Header text="Wall of Honor" navigation={() => navigation?.goBack()} />
      <View style={styles?.positionContainer}>
        <View style={styles?.position}>
          <Ionicons name="person-circle" size={130} color={"white"} />
          <Text style={styles.name}>{dummyTopThree[0].name}</Text>
          <View style={styles.ridesContainer}>
            <Ionicons name="disc" size={25} />
            <Text style={styles.rides}>{dummyTopThree[0].rides}</Text>
          </View>
        </View>
        <View style={styles?.position}>
          <Ionicons name="person-circle" size={150} color={"white"} />
          <Text style={styles.name}>{dummyTopThree[1].name}</Text>
          <View style={styles.ridesContainer}>
            <Ionicons name="disc" size={25} />
            <Text style={styles.rides}>{dummyTopThree[1].rides}</Text>
          </View>
        </View>
        <View style={styles?.position}>
          <Ionicons name="person-circle" size={110} color={"white"} />
          <Text style={styles.name}>{dummyTopThree[2].name}</Text>
          <View style={styles.ridesContainer}>
            <Ionicons name="disc" size={25} />
            <Text style={styles.rides}>{dummyTopThree[2].rides}</Text>
          </View>
        </View>
      </View>
      <FlatList
        data={dummyScoreCard}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <RankCard name={item?.name} ridesCount={item?.rides} />
        )}
      />
    </View>
  );
};

export default WallOfHonor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  positionContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: "#5188E3",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 30,
  },
  position: {
    justifyContent: "center",
    alignItems: "center",
  },
  ridesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 10,
  },
  name: {
    fontFamily: "Kanit-Regular",
    fontSize: 20,
    color: "white",
  },
  rides: {
    fontFamily: "Kanit-Light",
  },
});
