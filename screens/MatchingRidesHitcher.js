import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import PatronCard from "../components/PatronCard";

const MatchingRidesHitcher = ({ navigation, route }) => {
  const dummyPatrons = [
    {
      id: 1,
      name: "John Doe",
      rides: 47,
      availableSeats: 3,
      departureTime: "8:00 PM",
    },
    {
      id: 2,
      name: "John Doe",
      rides: 17,
      availableSeats: 4,
      departureTime: "8:00 PM",
    },
    {
      id: 3,
      name: "John Doe",
      rides: 39,
      availableSeats: 4,
      departureTime: "10:00 PM",
    },
    {
      id: 4,
      name: "John Doe",
      rides: 47,
      availableSeats: 3,
      departureTime: "8:00 PM",
    },
    {
      id: 5,
      name: "John Doe",
      rides: 26,
      availableSeats: 1,
      departureTime: "9:00 PM",
    },
  ];

  return (
    <View style={styles?.container}>
      <Header text="Matching Rides" navigation={navigation} />
      <TextInput
        value={route.params?.source}
        style={styles?.input}
        showSoftInputOnFocus={false}
      />
      <TextInput
        value={route.params?.destination}
        style={styles?.input}
        showSoftInputOnFocus={false}
      />
      <View style={styles?.patrons}>
        <FlatList
          data={dummyPatrons}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PatronDetails", { id: item?.id });
              }}
            >
              <PatronCard
                name={item?.name}
                rides={item?.rides}
                availableSeats={item?.availableSeats}
                time={item?.departureTime}
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
    fontWeight: "bold",
    height: 50,
    marginHorizontal: 10,
    paddingStart: 10,
    marginBottom: 15,
    color: "#758580",
  },
  patrons: {
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },
});
