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
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import {
  setSource,
  setDestination,
  setWayPoint,
} from "../redux/locations/locationsActions";

const SelectLocation = ({ navigation, route }) => {
  const dispatch = useDispatch();
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
        navigation={() => navigation?.goBack()}
      />
      <View style={styles.inputContainer}>
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
        <TouchableOpacity
          style={{ flex: 0.1 }}
          onPress={() => {
            navigation?.navigate("Map");
          }}
        >
          <Ionicons name="map" size={25} />
        </TouchableOpacity>
      </View>
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
              onPress={() => {
                route.params?.origin === "From"
                  ? dispatch(setSource(item?.short_name))
                  : route.params?.origin === "To"
                  ? dispatch(setDestination(item?.short_name))
                  : dispatch(setWayPoint(item?.short_name));
                navigation?.navigate({ name: "WhereTo", merge: true });
              }}
            >
              <Place title={item?.short_name} subtitle={item?.long_name} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default SelectLocation;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
  },
  input: {
    height: 50,
    fontSize: 15,
    paddingHorizontal: 15,
    flex: 0.9,
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
  bookmarkContainer: { flexDirection: "row", marginStart: 10 },
});
