import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import Map from "../components/Map";
import TimeLine from "../components/TimeLine";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

const HitcherDetails = ({ route, navigation }) => {
  const dummyHitcherDetails = [
    {
      id: 1,
      name: "John Doe",
      source: "Sanda, Lahore",
      destination: "PUCIT, Lahore",
    },
    {
      id: 2,
      name: "John Doe",
      source: "Sanda, Lahore",
      destination: "PUCIT, Lahore",
    },
  ];
  const [hitcher, setHitcher] = useState(null);
  useEffect(() => {
    const obj = dummyHitcherDetails?.find(
      (element) => element?.id === route.params?.id
    );
    setHitcher(obj);
  }, []);

  return (
    <>
      {hitcher ? (
        <View style={styles?.container}>
          <Header text="Ride Details" navigation={() => navigation?.goBack()} />
          <View style={styles?.headerContainer}>
            <Ionicons name="person-circle" size={100} color={"#5188E3"} />
            <View style={styles?.semiContainer}>
              <Text style={styles?.name}>{hitcher?.name}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <TimeLine
              source={hitcher?.source}
              destination={hitcher?.destination}
            />
          </View>
          <View style={styles?.statementContainer}>
            <Text style={styles?.statement}>Arriving on meeting point in </Text>
            <View style={styles?.timeContainer}>
              <Text style={styles?.time}>5 minutes</Text>
            </View>
          </View>
          <View style={{ flex: 6 }}>
            <Map />
          </View>
          <Button
            text="Message"
            onPress={() => {
              navigation?.navigate("Chat", { name: hitcher?.name });
            }}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default HitcherDetails;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  headerContainer: {
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
  time: {
    color: "white",
    fontFamily: "NunitoSans-SemiBold",
  },
  statement: {
    fontFamily: "NunitoSans-SemiBold",
  },
  statementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    flex: 1,
    justifyContent: "center",
  },
  timeContainer: {
    backgroundColor: "#5188E3",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
});
