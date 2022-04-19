import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Header from "../components/Header";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { useDispatch } from "react-redux";
import {
  setSource,
  setDestination,
  setWayPoint,
} from "../redux/locations/locationsActions";

const Map = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const onRegionChangeComplete = (region) => {
    setAddress("Loading...");
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region?.latitude},${region?.longitude}&key=${GOOGLE_MAPS_API_KEY}`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        let result = responseJson["results"][0];
        setAddress(result["formatted_address"]);

        setLocation({
          coords: result["geometry"]["location"],
          place_id: result["place_id"],
          formatted_address: result["formatted_address"],
          short_address: `${result["address_components"][0]["long_name"]}, ${result["address_components"][1]["short_name"]}`,
        });
      });
  };
  return (
    <View style={[StyleSheet?.absoluteFillObject, styles?.container]}>
      <MapView
        showsCompass={false}
        style={[StyleSheet?.absoluteFillObject, styles?.mapView]}
        initialRegion={{
          latitude: 30.3753,
          longitude: 69.3451,
          latitudeDelta: 12,
          longitudeDelta: 12,
        }}
        onRegionChangeComplete={onRegionChangeComplete}
      />
      <View style={styles?.heading}>
        <Header
          text="Select Custom Location"
          navigation={() => navigation?.navigate("SelectLocation")}
        />
      </View>
      <View style={styles?.marker}>
        <FontAwesome name="dot-circle-o" size={35} color={"#5188E3"} />
      </View>
      <View style={styles.textView}>
        <Text>{address}</Text>
      </View>
      <TouchableOpacity
        style={styles?.button}
        onPress={() => {
          route.params?.origin === "From"
            ? dispatch(setSource(location))
            : route.params?.origin === "To"
            ? dispatch(setDestination(location))
            : route.params?.origin === "Stop"
            ? dispatch(setWayPoint(location))
            : navigation?.navigate({
                name: "AdminSignUp",
                params: {
                  location: location,
                  company: route.params?.company,
                  password: route.params?.password,
                  email: route.params?.email,
                  domain: route.params?.domain,
                },
              });
          if (route.params?.origin !== "CompanyLocation")
            navigation?.navigate({ name: "WhereTo", merge: true });
        }}
      >
        <Ionicons name="checkmark-circle" size={80} color={"#5188E3"} />
      </TouchableOpacity>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  mapView: {
    flex: 1,
  },
  marker: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  textView: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-start",
    height: 50,
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingStart: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 30,
  },
  button: {
    flex: 0,
    position: "absolute",
    right: 15,
    bottom: 15,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    height: 80,
    width: 80,
  },
  heading: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
});
