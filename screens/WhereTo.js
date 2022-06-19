import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Map from "../components/Map";
import Button from "../components/Button";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
  setSource,
  removeWayPoint,
  resetLocationState,
  setDestination,
} from "../redux/locations/locationsActions";
import { setRideInWaiting } from "../redux/ride/rideActions";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";
import axios from "axios";
import ErrorDialog from "../components/ErrorDialog";
import useMountedState from "../custom-hooks/useMountedState";
import { clearRole } from "../redux/ride/rideActions";
import { useFocusEffect } from "@react-navigation/native";
import jwt_decode from "jwt-decode";
import { BASE_URL } from "../config/baseURL";

let apiCancelToken;
const WhereTo = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [error, setError] = useState("");
  const [orgLoc, setOrgLoc] = useState(null);
  const [reset, resetLocation] = useState(true);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const { role } = useSelector((state) => state?.ride);
  const { jwt } = useSelector((state) => state?.currentUser);
  const { source, destination, wayPoints } = useSelector(
    (state) => state?.locations
  );
  const dispatch = useDispatch();
  const ref = useRef(null);
  const isMounted = useMountedState();
  let decoded = jwt_decode(jwt);
  let organization_id = decoded?.organization_id;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        dispatch(clearRole());
        //dispatch(resetLocationState());
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const haversineFormula = (coords1, coords2) => {
    console.log(coords1, coords2);
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

  const checkRadius = () => {
    let betSourceAndOrg = haversineFormula(
      {
        lat: orgLoc?.coordinates?.latitude,
        lng: orgLoc?.coordinates?.longitude,
      },
      source?.coords
    );
    let betDestinationAndOrg = haversineFormula(
      {
        lat: orgLoc?.coordinates?.latitude,
        lng: orgLoc?.coordinates?.longitude,
      },
      destination?.coords
    );
    let betSourceAndDestination = haversineFormula(
      source?.coords,
      destination?.coords
    );
    if (betSourceAndOrg > 200 && betDestinationAndOrg > 200) {
      setError(
        "Either your source or destination should be within the 200 m radius of your organization."
      );
    } else if (betSourceAndDestination < 200) {
      setError("Source & Destination are too close.");
    } else if (
      source?.coords?.lat === destination?.coords?.lat &&
      source?.coords?.lng === destination?.coords?.lng
    ) {
      setError("Source & Destination can't be same!");
    } else
      role === "H"
        ? dispatch(setRideInWaiting())
        : navigation?.navigate("RideDetails");
  };

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    axios
      .get(`${BASE_URL}/organization/${organization_id}/location`, {
        timeout: 5000,
        cancelToken: apiCancelToken?.token,
      })
      .then((response) => {
        const resp = response?.data;
        console?.log(resp);
        if (isMounted()) setOrgLoc(resp);
      })
      .catch((error) => {
        console?.log(error);
        if (!connectionStatus) {
          if (isMounted()) setError("No Internet Connection!");
        } else if (error?.response) {
          if (isMounted()) setError(`${error?.response?.data}.`);
        } else if (error?.request) {
          if (isMounted())
            setError("Server not reachable! Please try again later.");
        } else if (axios.isCancel(error)) {
          console.log(error?.message);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        if (isMounted()) setLoading(false);
      });
    return () => {
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
    };
  }, [connectionStatus, isMounted]);

  useEffect(() => {
    if (isMounted() && source && orgLoc) {
      if (
        haversineFormula(source?.coords, {
          lat: orgLoc?.coordinates?.latitude,
          lng: orgLoc?.coordinates?.longitude,
        }) > 100
      ) {
        dispatch(
          setDestination({
            coords: {
              lat: orgLoc?.coordinates?.latitude,
              lng: orgLoc?.coordinates?.longitude,
            },
            formatted_address: orgLoc?.formatted_address,
            place_id: orgLoc?.place_id,
            short_address: orgLoc?.short_address,
          })
        );
      }
    }
  }, [source, isMounted, orgLoc]);

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    const getCurrentPosition = async () => {
      setMapLoading(true);
      Location.requestForegroundPermissionsAsync().then((response) => {
        if (response?.status === "granted") {
          Location.getCurrentPositionAsync({})
            .then((response) => {
              if (isMounted()) setLocation(response);
              axios
                .get(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${response?.coords?.latitude},${response?.coords?.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
                  { cancelToken: apiCancelToken?.token }
                )
                .then((response) => {
                  let result = response.data["results"][0];
                  if (isMounted()) {
                    dispatch(
                      setSource({
                        coords: result["geometry"]["location"],
                        place_id: result["place_id"],
                        formatted_address:
                          result?.formatted_address ||
                          "Unknown Formatted Address",
                        short_address: `${
                          result?.address_components[0]?.long_name || "unknown"
                        }, ${
                          result?.address_components[1]?.short_name || "unknown"
                        }`,
                      })
                    );
                    setMapLoading(false);
                  }
                })
                .catch((error) => {
                  console?.log(error);
                  setMapLoading(false);
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
              if (isMounted()) setMapLoading(false);
              if (!connectionStatus && isMounted())
                setError("No Internet Connection!");
            });
        } else {
          setMapLoading(false);
          setErrorMsg("Permission to access location was denied");
          dispatch(setSource(null));
        }
      });
    };
    if (orgLoc) getCurrentPosition();
    return () => {
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
    };
  }, [isMounted, connectionStatus, orgLoc, reset]);

  useEffect(() => {
    if (destination !== "" && ref?.current) {
      ref?.current?.setNativeProps({
        borderColor: "#B7B7B7",
      });
    }
  }, [destination]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <View style={styles?.container}>
      <Header
        text="Where to?"
        navigation={() => {
          dispatch(clearRole());
          // dispatch(resetLocationState());
          navigation?.goBack();
        }}
        isBackButtonVisible={true}
      />

      <Text style={styles.label}>From</Text>
      <View
        style={[
          styles?.input,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          },
        ]}
      >
        <TextInput
          value={source ? source?.short_address : errorMsg ?? "Loading..."}
          style={{
            fontSize: 15,
            height: 45,
            flex: 1,
            marginEnd: 5,
          }}
          selectionColor={"#5188E3"}
          placeholder="City, town, address or place"
          onPressOut={() =>
            navigation?.navigate("SelectLocation", {
              origin: "From",
              orgLoc: orgLoc,
            })
          }
          showSoftInputOnFocus={false}
        />
        <TouchableOpacity
          onPress={() => {
            resetLocation(!reset);
          }}
        >
          <Entypo name="location" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {wayPoints?.length != 0 && <Text style={styles?.label}>Way-Points</Text>}
      {route.params?.isPatron && wayPoints?.length != 0 ? (
        <FlatList
          style={{ flexGrow: 0, height: 60 }}
          data={wayPoints}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={[styles?.input, { flex: 0.9 }]}>
                {"Way-Point " + ++index + ": " + item?.short_address}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(removeWayPoint(item?.place_id));
                }}
              >
                <Ionicons name="close" size={25} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <></>
      )}
      <Text style={styles?.label}>To</Text>
      <TextInput
        ref={ref}
        value={source ? destination?.short_address : "Loading..."}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("SelectLocation", {
            origin: "To",
            orgLoc: orgLoc,
          })
        }
        showSoftInputOnFocus={false}
      />
      {route.params?.isPatron && wayPoints?.length < 10 ? (
        <TouchableOpacity
          style={styles?.waypoint}
          onPress={() => {
            navigation?.navigate("SelectLocation", {
              origin: "Stop",
              org_id: organization_id,
            });
          }}
        >
          <Text style={styles?.waypointText}>Add Way-Points</Text>
          <Ionicons name="add-circle-outline" color={"white"} size={20} />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <Map
        loading={mapLoading}
        navigation={() => {
          navigation?.navigate("Full Screen Map");
        }}
      />
      <Button
        isDisabled={!orgLoc}
        text={route.params?.isPatron ? "Continue" : "Find Matching Rides"}
        onPress={() => {
          if (destination === null && ref.current) {
            ref.current.setNativeProps({
              borderColor: "red",
            });
          } else {
            checkRadius();
          }
        }}
      />
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

export default WhereTo;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    fontFamily: "NunitoSans-SemiBold",
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlignVertical: "center",
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
});
