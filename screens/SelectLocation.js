import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import Place from "../components/Place";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import {
  setSource,
  setDestination,
  setWayPoint,
} from "../redux/locations/locationsActions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@env";

const SelectLocation = ({ navigation, route }) => {
  const dispatch = useDispatch();
  return (
    <View style={styles?.container}>
      <Header
        text={
          route.params?.origin === "From"
            ? "Enter Source"
            : route.params?.origin === "To"
            ? "Enter Destination"
            : route.params?.origin === "Stop"
            ? "Enter Way-Point"
            : "Enter Company Location"
        }
        navigation={() => navigation?.goBack()}
        isBackButtonVisible={true}
      />
      <GooglePlacesAutocomplete
        placeholder={
          route.params?.origin === "From"
            ? "Enter Source"
            : route.params?.origin === "To"
            ? "Enter Destination"
            : route.params?.origin === "Stop"
            ? "Enter Way-Point"
            : "Enter Company Location"
        }
        renderRow={(data, index) => (
          <View style={styles?.places}>
            <Place
              title={data?.structured_formatting?.main_text}
              subtitle={data?.structured_formatting?.secondary_text}
            />
          </View>
        )}
        onPress={(data, details = null) => {
          route.params?.origin === "From"
            ? dispatch(
                setSource({
                  coords: details["geometry"]["location"],
                  place_id: details["place_id"],
                  formatted_address: details["formatted_address"],
                  short_address: `${details["address_components"][0]["long_name"]}, ${details["address_components"][1]["short_name"]}`,
                })
              )
            : route.params?.origin === "To"
            ? dispatch(
                setDestination({
                  coords: details["geometry"]["location"],
                  place_id: details["place_id"],
                  formatted_address: details["formatted_address"],
                  short_address: `${details["address_components"][0]["long_name"]}, ${details["address_components"][1]["short_name"]}`,
                })
              )
            : route.params?.origin === "Stop"
            ? dispatch(
                setWayPoint({
                  coords: details["geometry"]["location"],
                  place_id: details["place_id"],
                  formatted_address: details["formatted_address"],
                  short_address: `${details["address_components"][0]["long_name"]}, ${details["address_components"][1]["short_name"]}`,
                })
              )
            : navigation?.navigate({
                name: "AdminSignUp",
                params: {
                  location: {
                    coords: details["geometry"]["location"],
                    place_id: details["place_id"],
                    formatted_address: details["formatted_address"],
                    short_address: `${details["address_components"][0]["long_name"]}, ${details["address_components"][1]["short_name"]}`,
                  },
                  company: route.params?.company,
                  password: route.params?.password,
                  email: route.params?.email,
                  domain: route.params?.domain,
                },
              });
          if (route.params?.origin !== "CompanyLocation")
            navigation?.navigate({ name: "WhereTo", merge: true });
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
          components: "country:pk",
        }}
        renderRightButton={() => (
          <TouchableOpacity
            style={{ flex: 0.1 }}
            onPress={() => {
              route.params?.origin === "CompanyLocation"
                ? navigation?.navigate("MapForCompanyLocation", {
                    origin: route?.params?.origin,
                    company: route.params?.company,
                    password: route.params?.password,
                    email: route.params?.email,
                    domain: route.params?.domain,
                  })
                : navigation?.navigate("Map", {
                    origin: route?.params?.origin,
                  });
            }}
          >
            <Ionicons name="map" size={25} />
          </TouchableOpacity>
        )}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
        minLength={2}
        fetchDetails={true}
        styles={{
          textInputContainer: styles?.inputContainer,
          textInput: styles?.input,
          row: {
            padding: 0,
            backgroundColor: "rgba(0, 0, 0, 0)",
          },
          separator: {
            height: 0,
          },
        }}
      />
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
    height: 45,
    fontSize: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
    flex: 0.9,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  places: {
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },
});
