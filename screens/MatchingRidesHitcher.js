import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import PatronCard from "../components/PatronCard";
import { useSelector } from "react-redux";

const MatchingRidesHitcher = ({ navigation }) => {
  const { source, destination } = useSelector((state) => state?.locations);
  const dummyPatrons = [
    {
      ride_id: 1,
      patron_name: "John Doe",
      vehicle_type: "bike",
      ride_count: 3,
      departureTime: "8:00 PM",
    },
    {
      ride_id: 2,
      patron_name: "John Doe",
      vehicle_type: "car",
      ride_count: 3,
      departureTime: "8:00 PM",
    },
  ];

  return (
    <View style={styles?.container}>
      <Header text="Matching Rides" navigation={() => navigation?.goBack()} />
      <Text style={styles?.input}>
        Source: {source && `${source?.formatted_address}`}
      </Text>
      <Text style={styles?.input}>
        Destination: {destination && `${destination?.formatted_address}`}
      </Text>
      <View style={styles?.patrons}>
        <FlatList
          data={dummyPatrons}
          keyExtractor={(item) => item?.ride_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation?.navigate("PatronDetails", { id: item?.ride_id });
              }}
            >
              <PatronCard
                name={item?.patron_name}
                rides={item?.ride_count}
                time={item?.departureTime}
                vehicle_type={item?.vehicle_type}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default MatchingRidesHitcher;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: "200",
    fontFamily: "NunitoSans-Bold",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    paddingVertical: 5,
    color: "#758580",
    textAlignVertical: "center",
    minHeight: 50,
  },
  patrons: {
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },
});
