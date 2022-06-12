import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { setRideID } from "../redux/ride/rideActions";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { clearRideID, clearRideStatus } from "../redux/ride/rideActions";
import { resetLocationState } from "../redux/locations/locationsActions";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { useFocusEffect } from "@react-navigation/native";
import ErrorDialog from "../components/ErrorDialog";

const SCREEN_WIDTH = Dimensions.get("window").width;

let apiCancelToken;
const MatchingRidesHitcher = ({ navigation }) => {
  const dispatch = useDispatch();
  const { source, destination } = useSelector((state) => state?.locations);
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const [radiusValue, setRadiusValue] = useState(200);
  const [radius, setRadius] = useState([
    { label: "300 m", value: 300 },
    { label: "400 m", value: 400 },
    { label: "500 m", value: 500 },
    { label: "600 m", value: 600 },
    { label: "700 m", value: 700 },
    { label: "800 m", value: 800 },
    { label: "900 m", value: 900 },
    { label: "1000 m", value: 1000 },
  ]);
  const [stayOnPageError, setStayOnPageError] = useState("");
  const [goBackError, setGoBackError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [retry, setRetry] = useState(false);
  const pairRide = () => {
    const data = {
      pickup: {
        coordinates: {
          latitude: source?.coords?.lat,
          longitude: source?.coords?.lng,
        },
        formatted_address: source?.formatted_address,
        place_id: source?.place_id,
      },
      dropoff: {
        coordinates: {
          latitude: destination?.coords?.lat,
          longitude: destination?.coords?.lng,
        },
        formatted_address: destination?.formatted_address,
        place_id: destination?.place_id,
      },
      threshold: radiusValue,
    };
    console.log(data);
    axios
      .post(`${BASE_URL}/ride/hitcher/pair`, data, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cancelToken: apiCancelToken?.token,
      })
      .then((response) => {
        console?.log(response.data);
        dispatch(setRideID(response.data?.ride_id));
      })
      .catch((error) => {
        if (!connectionStatus) {
          setGoBackError("No Internet connection!");
        } else if (error?.response) {
          if (error?.response?.status !== 404) {
            setGoBackError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          }
        } else if (error?.request) {
          setGoBackError("Server not reachable! Please try again later.");
        } else if (axios.isCancel(error)) {
          console.log(error?.message);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    setLoading(true);
    const timer = setTimeout(() => {
      //dispatch(setRideID(1));
      pairRide();
    }, 10 * 1000);
    return () => {
      clearTimeout(timer);
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
    };
  }, [retry]);

  return (
    <View style={styles?.container}>
      <Header
        text="Matching Your Ride..."
        navigation={() => navigation?.goBack()}
        isBackButtonVisible={true}
        isCancel={true}
        onCancel={() => {
          setCancel(true);
        }}
      />
      <Text style={styles?.input}>
        Source: {source && `${source?.formatted_address}`}
      </Text>
      <Text style={styles?.input}>
        Destination: {destination && `${destination?.formatted_address}`}
      </Text>
      <View style={styles?.patrons}>
        {loading ? (
          <>
            <View style={styles?.textContainer}>
              <Text style={styles?.primaryText}>
                Searching for a Patrons...
              </Text>
              <Text style={styles?.secondaryText}>
                This may take a some time.
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <ActivityIndicator size="large" color="#5188E3" />
            </View>
          </>
        ) : (
          <>
            <View style={styles?.radiusContainer}>
              <DropDownPicker
                style={styles?.dropdown}
                open={radiusOpen}
                value={radiusValue}
                items={radius}
                setOpen={setRadiusOpen}
                setValue={setRadiusValue}
                setItems={setRadius}
                placeholder="Select Radius"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
            <View style={styles?.noPatronContainer}>
              <Entypo name="dropbox" size={SCREEN_WIDTH / 1.8} color="grey" />
              <Text style={styles?.primaryText}>
                No Patron Available Right Now.
              </Text>
              <Text style={styles?.secondaryText}>
                Try again after sometime or change the radius to expand the area
                for the search of patron.
              </Text>
              <TouchableOpacity
                style={styles?.tryAgainButton}
                onPress={() => {
                  setRetry(!retry);
                }}
              >
                <Text style={styles?.tryAgainText}>Search Again</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View>
        <ErrorDialog
          visible={!!goBackError || !!stayOnPageError}
          errorHeader={"Error!"}
          errorDescription={!!goBackError ? goBackError : stayOnPageError}
          clearError={() => {
            if (!!goBackError) dispatch(clearRideStatus());
            else setStayOnPageError("");
          }}
        />
      </View>
      <View>
        <ConfirmationDialog
          visible={cancel}
          heading={"Wait!"}
          body={"Are you sure you want to cancel your ride?"}
          positiveHandler={() => {
            dispatch(clearRideStatus());
            //dispatch(resetLocationState());
          }}
          negativeHandler={() => {
            setCancel(false);
          }}
        />
      </View>
    </View>
  );
};

export default MatchingRidesHitcher;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: "200",
    fontFamily: "NunitoSans-Bold",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    paddingVertical: 5,
    color: "#758580",
    textAlignVertical: "center",
    minHeight: 50,
  },
  patrons: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  primaryText: {
    fontFamily: "NunitoSans-Bold",
    fontSize: SCREEN_WIDTH / 16,
    color: "#5188E3",
    textAlign: "center",
  },
  secondaryText: {
    fontFamily: "NunitoSans-Regular",
    fontSize: SCREEN_WIDTH / 25,
    color: "grey",
    textAlign: "center",
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 45,
    backgroundColor: "#f2f2f2",
  },
  radiusContainer: {
    width: "50%",
    alignSelf: "flex-end",
    marginEnd: 10,
  },
  noPatronContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    alignSelf: "center",
  },
  tryAgainButton: {
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  tryAgainText: {
    fontFamily: "Kanit-Medium",
  },
});
