import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Map from "../components/Map";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import {
  setSource,
  removeWayPoint,
  resetLocationState,
} from "../redux/locations/locationsActions";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";
import axios from "axios";
import ErrorDialog from "../components/ErrorDialog";
import useMountedState from "../custom-hooks/useMountedState";

let apiCancelToken;
const WhereTo = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [error, setError] = useState("");
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const { source, destination, wayPoints } = useSelector(
    (state) => state?.locations
  );
  const dispatch = useDispatch();
  const ref = useRef(null);
  const isMounted = useMountedState();

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    const getCurrentPosition = async () => {
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
                        formatted_address: result["formatted_address"],
                        short_address: `${result["address_components"][0]["long_name"]}, ${result["address_components"][1]["short_name"]}`,
                      })
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
              if (!connectionStatus && isMounted())
                setError("No Internet Connection!");
            });
        } else {
          setErrorMsg("Permission to access location was denied");
          dispatch(setSource(null));
        }
      });
    };
    getCurrentPosition();
    return () => {
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
      dispatch(resetLocationState());
    };
  }, [isMounted, connectionStatus]);
  useEffect(() => {
    if (destination !== "" && ref?.current) {
      ref?.current?.setNativeProps({
        borderColor: "#B7B7B7",
      });
    }
  }, [destination]);

  return (
    <View style={styles?.container}>
      <Header text="Where to?" navigation={() => navigation?.goBack()} />

      <Text style={styles.label}>From</Text>
      <TextInput
        value={location ? source?.short_address : errorMsg ?? "Loading..."}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("SelectLocation", { origin: "From" })
        }
        showSoftInputOnFocus={false}
      />
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
        value={destination?.short_address}
        style={styles?.input}
        selectionColor={"#5188E3"}
        placeholder="City, town, address or place"
        onPressOut={() =>
          navigation?.navigate("SelectLocation", { origin: "To" })
        }
        showSoftInputOnFocus={false}
      />
      {route.params?.isPatron && wayPoints?.length < 10 ? (
        <TouchableOpacity
          style={styles?.waypoint}
          onPress={() => {
            navigation?.navigate("SelectLocation", { origin: "Stop" });
          }}
        >
          <Text style={styles?.waypointText}>Add Way-Points</Text>
          <Ionicons name="add-circle-outline" color={"white"} size={20} />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <Map
        navigation={() => {
          navigation?.navigate("Full Screen Map");
        }}
      />
      <Button
        text={route.params?.isPatron ? "Continue" : "Find Matching Rides"}
        onPress={() => {
          if (destination === null && ref.current) {
            ref.current.setNativeProps({
              borderColor: "red",
            });
          } else {
            !route.params?.isPatron
              ? navigation?.navigate("MatchingRidesHitcher")
              : navigation?.navigate("RideDetails");
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
