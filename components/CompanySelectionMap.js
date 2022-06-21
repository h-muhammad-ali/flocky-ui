import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import usePrevious from "../custom-hooks/usePrevious";
var _ = require("lodash");
import axios from "axios";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";
import { setCompanyLocation } from "../redux/companyLocation/companyLocationActions";

let apiCancelToken;
const CompanySelectionMap = () => {
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const { location } = useSelector((state) => state?.companyLocation);
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const prevLocation = usePrevious(location);

  const onRegionChangeComplete = (region) => {
    if (location) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region?.latitude},${region?.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
          { cancelToken: apiCancelToken?.token }
        )
        .then((response) => {
          let result = response.data["results"][0];
          dispatch(
            setCompanyLocation({
              coords: { lat: region?.latitude, lng: region?.longitude },
              place_id: result["place_id"],
              formatted_address:
                result?.formatted_address || "Unknown Formatted Address",
              short_address: `${
                result?.address_components[0]?.long_name || "unknown"
              }, ${result?.address_components[1]?.short_name || "unknown"}`,
            })
          );
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
                dispatch(
                  setCompanyLocation({
                    coords: {
                      lat: response?.coords?.latitude,
                      lng: response?.coords?.longitude,
                    },
                    place_id: result["place_id"],
                    formatted_address:
                      result?.formatted_address || "Unknown Formatted Address",
                    short_address: `${
                      result?.address_components[0]?.long_name || "unknown"
                    }, ${
                      result?.address_components[1]?.short_name || "unknown"
                    }`,
                  })
                );

                // const coords = result["geometry"]["location"];
                // mapRef?.current?.animateToRegion(
                //   {
                //     latitude: coords?.lat,
                //     longitude: coords?.lng,
                //     latitudeDelta: 0.01,
                //     longitudeDelta: 0.01,
                //   },
                //   1000
                // );
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
      }
    });
  };
  // useEffect(() => {
  //   getCurrentPosition();
  // }, []);
  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    if (location) {
      setTimeout(() => {
        animateRegion();
      }, 1500);
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
      1000
    );
  };
  return (
    <View style={styles?.container}>
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
      {location ? (
        <View style={styles?.marker}>
          <FontAwesome name="dot-circle-o" size={35} color={"#5188E3"} />
        </View>
      ) : (
        <></>
      )}
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

export default CompanySelectionMap;

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
