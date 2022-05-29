import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { useDispatch } from "react-redux";
import {
  setSource,
  setDestination,
  setWayPoint,
} from "../redux/locations/locationsActions";
import * as Location from "expo-location";
import usePrevious from "../custom-hooks/usePrevious";
var _ = require("lodash");
import axios from "axios";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";

let apiCancelToken;
const Map = ({ navigation, route }) => {
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const prevLocation = usePrevious(location);
  const dispatch = useDispatch();
  const onRegionChangeComplete = (region) => {
    setAddress("Loading...");
    if (location === null && prevLocation === undefined) {
      getCurrentPosition();
    } else {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region?.latitude},${region?.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
          { cancelToken: apiCancelToken?.token }
        )
        .then((response) => {
          let result = response.data["results"][0];
          setAddress(result["formatted_address"]);
          setLocation({
            coords: result["geometry"]["location"],
            place_id: result["place_id"],
            formatted_address: result["formatted_address"],
            short_address: `${result["address_components"][0]["long_name"]}, ${result["address_components"][1]["short_name"]}`,
          });
        })
        .catch((error) => {
          console?.log(error);
          if (connectionStatus) {
            if (axios.isCancel(error)) {
              console.log(error?.message);
            } else {
              setError(
                "There is some issue with Google Maps API. Please try again later."
              );
            }
          } else {
            setError("No Internet Connection!");
          }
        });
    }
  };
  const getCurrentPosition = async (isAnimate = false) => {
    Location.requestForegroundPermissionsAsync().then((response) => {
      if (response?.status === "granted") {
        Location.getCurrentPositionAsync({})
          .then((response) => {
            axios
              .get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=
                  ${response?.coords?.latitude},${response?.coords?.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
                { cancelToken: apiCancelToken?.token }
              )
              .then((response) => {
                let result = response.data["results"][0];
                setAddress(result["formatted_address"]);
                setLocation({
                  coords: result["geometry"]["location"],
                  place_id: result["place_id"],
                  formatted_address: result["formatted_address"],
                  short_address: `${result["address_components"][0]["long_name"]}, ${result["address_components"][1]["short_name"]}`,
                });
                if (isAnimate) {
                  const coords = result["geometry"]["location"];
                  mapRef?.current?.animateToRegion(
                    {
                      latitude: coords?.lat,
                      longitude: coords?.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    },
                    2000
                  );
                }
              })
              .catch((error) => {
                console?.log(error);
                if (connectionStatus) {
                  if (axios.isCancel(error)) {
                    console.log(error?.message);
                  } else {
                    setError(
                      "There is some issue with Google Maps API. Please try again later."
                    );
                  }
                } else {
                  setError("No Internet Connection!");
                }
              });
          })
          .catch((error) => {
            console?.log(error?.message);
            if (!connectionStatus) setError("No Internet Connection!");
          });
      } else {
        setErrorMsg("Permission to access location was denied");
        dispatch(setSource(null));
      }
    });
  };
  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    if (prevLocation === null) {
      setTimeout(() => {
        animateRegion();
      }, 1000);
    }
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, [location]);
  const animateRegion = () => {
    mapRef?.current?.animateToRegion(
      {
        latitude: location?.coords?.lat,
        longitude: location?.coords?.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      2000
    );
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
        ref={mapRef}
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
        style={styles?.currentLocation}
        onPress={() => {
          if (location?.place_id !== prevLocation?.place_id)
            getCurrentPosition(true);
        }}
      >
        <MaterialIcons name="my-location" size={60} color="black" />
      </TouchableOpacity>
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
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Error"}
          errorDescription={error}
          clearError={() => {
            setError("");
          }}
        />
      </View>
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
  currentLocation: {
    flex: 0,
    position: "absolute",
    right: 30,
    bottom: 100,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    height: 80,
    width: 80,
  },
});
