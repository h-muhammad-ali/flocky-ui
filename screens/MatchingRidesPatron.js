import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Header from "../components/Header";
import HitcherCard from "../components/HitcherCard";
import Button from "../components/Button";
import { useSelector } from "react-redux";

const MatchingRidesPatron = ({ navigation }) => {
  const dummyHitchers = [
    {
      id: 1,
      name: "Suleman",
    },
    {
      id: 2,
      name: "Ahsan",
    },
  ];
  const { source, destination } = useSelector((state) => state?.locations);
  return (
    <View style={styles?.container}>
      <Header
        text="Matching Rides"
        navigation={() => navigation?.goBack()}
        isCancel={true}
        onCancel={() => {}}
      />
      <Text style={styles?.text}>
        Source: {source && `${source?.formatted_address}`}
      </Text>
      <Text style={styles?.text}>
        Destination: {destination && `${destination?.formatted_address}`}
      </Text>
      <View style={styles?.hitchers}>
        <FlatList
          data={dummyHitchers}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <HitcherCard
              onPress={() => {
                navigation?.navigate("HitcherDetails", { id: item?.id });
              }}
            />
          )}
        />
      </View>
      <View>
        <Button text="Start Ride" onPress={() => {}} />
      </View>
    </View>
  );
};

export default MatchingRidesPatron;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  text: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
    paddingStart: 10,
    marginBottom: 15,
    color: "#758580",
    textAlignVertical: "center",
    minHeight: 50,
  },
  hitchers: {
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },
});
