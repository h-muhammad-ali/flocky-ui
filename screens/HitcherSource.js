import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Bookmark from "../components/Bookmark";
import Header from "../components/Header";
import Place from "../components/Place";

const HitcherSource = ({ navigation, route }) => {
  const dummyPlaces = [
    {
      id: 1,
      short_name: "Sanda",
      long_name: "Sanda Khurd, Lahore",
    },
    {
      id: 2,
      short_name: "Shadbagh",
      long_name: "Shadbagh, Lahore",
    },
    {
      id: 3,
      short_name: "Ichraa",
      long_name: "Ichraa, Lahore",
    },
    {
      id: 4,
      short_name: "Garhi Shahu",
      long_name: "Habibullah Road, Lahore",
    },
  ];

  return (
    <View style={styles?.container}>
      <Header
        text={
          route.params?.origin === "From"
            ? "Enter Source"
            : route.params?.origin === "To"
            ? "Enter Destination"
            : "Enter Way-Point"
        }
        navigation={navigation}
      />
      <TextInput
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder={
          route.params?.origin === "From"
            ? "Enter Source"
            : route.params?.origin === "To"
            ? "Enter Destination"
            : "Enter Way-Point"
        }
      />
      {route.params?.origin === "Stop" ? (
        <></>
      ) : (
        <View style={styles.bookmarkContainer}>
          <Bookmark text="Home" />
          <Bookmark text="Work" />
        </View>
      )}
      <View style={styles?.line} />
      <View style={styles?.places}>
        <FlatList
          data={dummyPlaces}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPressOut={() =>
                navigation.navigate({
                  name: "WhereTo",
                  params:
                    route.params?.origin === "From"
                      ? { source: item?.short_name }
                      : route.params?.origin === "To"
                      ? { destination: item?.short_name }
                      : { stop: item?.short_name },
                  merge: true,
                })
              }
            >
              <Place title={item?.short_name} subtitle={item?.long_name} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default HitcherSource;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  input: {
    borderStyle: "solid",
    height: 50,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 15,
    marginHorizontal: 10,
    paddingStart: 15,
    marginBottom: 15,
  },
  line: {
    alignSelf: "center",
    borderStyle: "solid",
    borderWidth: 0.5,
    marginTop: 30,
    width: "95%",
  },
  places: {
    width: "95%",
    alignSelf: "center",
    flex: 1,
  },
  setOnMap: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#999595",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  setOnMapText: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 15,
    color: "#666666",
  },
  waypoint: {
    backgroundColor: "#5188E3",
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 10,
    paddingStart: 10,
  },
  waypointText: {
    color: "white",
  },
  bookmarkContainer: { flexDirection: "row", marginStart: 10 },
});
