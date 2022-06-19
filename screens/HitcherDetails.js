import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  AppState,
  ToastAndroid,
} from "react-native";
import Button from "../components/Button";
import TimeLine from "../components/TimeLine";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";
import MapForPatron from "../components/MapForPatron";
import { useFocusEffect } from "@react-navigation/native";
import ProfilePicture from "../components/ProfilePicture";

let apiCancelToken;
const HitcherDetails = ({ route, navigation }) => {
  const [stayOnPageError, setStayOnPageError] = useState("");
  const [goBackError, setGoBackError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hitcher, setHitcher] = useState(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const { rideID } = useSelector((state) => state?.ride);
  const { jwt } = useSelector((state) => state?.currentUser);

  const checkRideStatus = (set = null, func = null) => {
    if (appStateVisible === "active") {
      setLoading(true);
      axios
        .get(`${BASE_URL}/ride/hitcher/${route.params?.id}/${rideID}/status`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cancelToken: apiCancelToken?.token,
        })
        .then((response) => {
          const resp = response?.data;
          console.log(resp);
          if (resp?.status === "C") {
            setGoBackError("This hitcher has cancelled the ride.");
          } else if (resp?.status === "P" && func === "LL") {
            setStayOnPageError(
              "Ride is already in progress. Your Patron is with you already."
            );
          } else {
            if (set !== null) {
              set();
            }
          }
        })
        .catch((error) => {
          if (!connectionStatus) {
            setStayOnPageError("No Internet connection!");
          } else if (error?.response) {
            setStayOnPageError(`${error?.response?.data}.`);
          } else if (error?.request) {
            setStayOnPageError(
              "Server not reachable! Can't get your vehicles."
            );
          } else if (axios.isCancel(error)) {
            console.log(error?.message);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      apiCancelToken = axios.CancelToken.source();
      checkRideStatus();
      return () =>
        apiCancelToken?.cancel(
          "API Request was cancelled because of component unmount."
        );
    }, [appStateVisible, connectionStatus])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  useEffect(() => {
    const fetchHitcherDetails = () => {
      setLoading(true);
      axios
        .get(
          `${BASE_URL}/ride/patron/${rideID}/hitcher_details/${route.params?.id}`,
          {
            timeout: 5000,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            cancelToken: apiCancelToken?.token,
          }
        )
        .then((response) => {
          const resp = response?.data;
          setHitcher(resp);
        })
        .catch((error) => {
          if (!connectionStatus) {
            // setGoBackError("No Internet connection!");
            ToastAndroid.show("No Internet Connection", ToastAndroid?.SHORT);
            navigation?.goBack();
          } else if (error?.response) {
            // setGoBackError(`${error?.response?.data}.`);
            ToastAndroid.show(error?.response?.data, ToastAndroid?.SHORT);
            navigation?.goBack();
          } else if (error?.request) {
            // setGoBackError("Server not reachable! Can't get your vehicles.");
            ToastAndroid.show(
              "Server not reachable! Can't get your vehicles.",
              ToastAndroid?.SHORT
            );
            navigation?.goBack();
          } else if (axios.isCancel(error)) {
            console.log(error?.message);
            ToastAndroid.show("Something went wrong!", ToastAndroid?.SHORT);
            navigation?.goBack();
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
    apiCancelToken = axios.CancelToken.source();
    fetchHitcherDetails();
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, []);

  if (loading || !hitcher) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <View style={styles?.container}>
      <Header
        text="Ride Details"
        navigation={() => navigation?.goBack()}
        isBackButtonVisible={true}
      />
      <View style={styles?.headerContainer}>
        {/* <Image source={{ uri: hitcher?.img_url }} style={styles?.image} /> */}
        <ProfilePicture imageURL={hitcher?.img_url} size={90} />
        <View style={styles?.semiContainer}>
          <Text style={styles?.name}>{hitcher?.name}</Text>
        </View>
      </View>
      <View style={{ flex: 1.5 }}>
        <TimeLine
          source={hitcher?.pickup_location?.formatted_address}
          destination={hitcher?.dropoff_location?.formatted_address}
        />
      </View>

      <TouchableOpacity
        style={styles?.liveLocationButton}
        onPress={() => {
          if (connectionStatus) {
            checkRideStatus(() => {
              navigation?.navigate("Live Location", {
                id: hitcher?.id,
                name: hitcher?.name,
              });
            }, "LL");
          } else {
            setStayOnPageError("No Internet Connection!");
          }
        }}
      >
        <Text style={styles?.liveLocationText}>See Live Location</Text>
        <Ionicons name="location" size={20} />
      </TouchableOpacity>

      <View style={{ flex: 6, marginHorizontal: 10 }}>
        <MapForPatron
          start={{
            coords: {
              lat: hitcher?.pickup_location?.coordinates?.latitude,
              lng: hitcher?.pickup_location?.coordinates?.longitude,
            },
            formatted_address: hitcher?.pickup_location?.formatted_address,
            place_id: hitcher?.pickup_location?.place_id,
          }}
          end={{
            coords: {
              lat: hitcher?.dropoff_location?.coordinates?.latitude,
              lng: hitcher?.dropoff_location?.coordinates?.longitude,
            },
            formatted_address: hitcher?.dropoff_location?.formatted_address,
            place_id: hitcher?.dropoff_location?.place_id,
          }}
          navigation={() => {
            navigation?.navigate("Full Screen Map For Patron", {
              start: {
                coords: {
                  lat: hitcher?.pickup_location?.coordinates?.latitude,
                  lng: hitcher?.pickup_location?.coordinates?.longitude,
                },
                formatted_address: hitcher?.pickup_location?.formatted_address,
                place_id: hitcher?.pickup_location?.place_id,
              },
              end: {
                coords: {
                  lat: hitcher?.dropoff_location?.coordinates?.latitude,
                  lng: hitcher?.dropoff_location?.coordinates?.longitude,
                },
                formatted_address: hitcher?.dropoff_location?.formatted_address,
                place_id: hitcher?.dropoff_location?.place_id,
              },
            });
          }}
        />
      </View>

      <Button
        text="Message"
        onPress={() => {
          if (connectionStatus) {
            checkRideStatus(() => {
              navigation?.navigate("Chat", {
                name: hitcher?.name,
                id: hitcher?.id,
              });
            });
          } else {
            setStayOnPageError("No Internet Connection!");
          }
        }}
      />
      <View>
        <ErrorDialog
          visible={!!goBackError || !!stayOnPageError}
          errorHeader={"Error!"}
          errorDescription={!!goBackError ? goBackError : stayOnPageError}
          clearError={() => {
            if (!!goBackError) navigation.goBack();
            else setStayOnPageError("");
          }}
        />
      </View>
    </View>
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
  liveLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5188E3",
    marginVertical: 5,
    marginHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
  },
  liveLocationText: { color: "white", marginEnd: 5 },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
