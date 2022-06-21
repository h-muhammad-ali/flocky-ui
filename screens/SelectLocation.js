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
import { setCompanyLocation } from "../redux/companyLocation/companyLocationActions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_API_KEY } from "@env";

const SelectLocation = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const haversineFormula = (coords1, coords2) => {
    const R = 6371000;
    let latDiff = (coords2.lat - coords1.lat) * (Math.PI / 180);
    let longDiff = (coords2.lng - coords1.lng) * (Math.PI / 180);

    let a =
      Math.pow(Math.sin(latDiff / 2), 2) +
      Math.cos(coords1.lat * (Math.PI / 180)) *
        Math.cos(coords2.lat * (Math.PI / 180)) *
        Math.pow(Math.sin(longDiff / 2), 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const dispatchSource = (details) => {
    if (
      haversineFormula(details["geometry"]["location"], {
        lat: route.params?.orgLoc?.coordinates?.latitude,
        lng: route.params?.orgLoc?.coordinates?.longitude,
      }) > 100
    ) {
      dispatch(
        setSource({
          coords: details["geometry"]["location"],
          place_id: details["place_id"],
          formatted_address:
            details?.formatted_address || "Unknown Formatted Address",
          short_address: `${
            details?.address_components[0]?.long_name || "unknown"
          }, ${details?.address_components[1]?.short_name || "unknown"}`,
        })
      );
      dispatch(
        setDestination({
          ...route.params?.orgLoc,
          coords: {
            lat: route.params?.orgLoc?.coordinates?.latitude,
            lng: route.params?.orgLoc?.coordinates?.longitude,
          },
        })
      );
    } else {
      dispatch(
        setSource({
          coords: details["geometry"]["location"],
          place_id: details["place_id"],
          formatted_address:
            details?.formatted_address || "Unknown Formatted Address",
          short_address: `${
            details?.address_components[0]?.long_name || "unknown"
          }, ${details?.address_components[1]?.short_name || "unknown"}`,
        })
      );
      dispatch(setDestination(null));
    }
  };
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
            ? dispatchSource(details)
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
            : dispatch(
                setCompanyLocation({
                  coords: details["geometry"]["location"],
                  place_id: details["place_id"],
                  formatted_address: details["formatted_address"],
                  short_address: `${details["address_components"][0]["long_name"]}, ${details["address_components"][1]["short_name"]}`,
                })
              );
          if (route.params?.origin === "CompanyLocation") {
            navigation?.navigate({
              name: "MapScreenForAdmin",
              merge: true,
            });
          }
          // : navigation?.navigate({
          //     name: "AdminSignUp",
          //     params: {
          //       location: {
          //         coords: details["geometry"]["location"],
          //         place_id: details["place_id"],
          //         formatted_address: details["formatted_address"],
          //         short_address: `${details["address_components"][0]["long_name"]}, ${details["address_components"][1]["short_name"]}`,
          //       },
          //       company: route.params?.company,
          //       password: route.params?.password,
          //       email: route.params?.email,
          //       domain: route.params?.domain,
          //     },
          //   });
          if (route.params?.origin !== "CompanyLocation")
            navigation?.navigate({ name: "WhereTo", merge: true });
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
          components: "country:pk",
        }}
        renderRightButton={() =>
          route.param?.origin !== "CompanyLocation" ? (
            <TouchableOpacity
              style={{ flex: 0.1 }}
              onPress={() => {
                route.params?.origin === "CompanyLocation"
                  ? navigation.navigate("MapForCompanyLocation", {
                      origin: "CompanyLocation",
                    })
                  : // ? navigation?.navigate("MapForCompanyLocation", {
                    //     origin: route?.params?.origin,
                    //     company: route.params?.company,
                    //     password: route.params?.password,
                    //     email: route.params?.email,
                    //     domain: route.params?.domain,
                    //   })
                    navigation?.navigate("Map", {
                      origin: route?.params?.origin,
                      orgLoc: route.params?.orgLoc,
                    });
              }}
            >
              <Ionicons name="map" size={25} />
            </TouchableOpacity>
          ) : (
            <></>
          )
        }
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
