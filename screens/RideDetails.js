import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AddVehicleDialog from "../components/AddVehicleDialog";
import Button from "../components/Button";
import ErrorDialog from "../components/ErrorDialog";
import Checkbox from "expo-checkbox";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import { setRideID } from "../redux/ride/rideActions";

let apiCancelToken;
const RideDetails = ({ navigation }) => {
  const dispatch = useDispatch();
  const { source, destination, wayPoints, overview_polyline } = useSelector(
    (state) => state?.locations
  );
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [departureTime, setDepartureTime] = useState(
    addMinutes(new Date(), 20)
  );
  const [departureDate, setDepartureDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seatsCount, setSeatsCount] = useState(1);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicleValue, setVehicleValue] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleID, setVehicleID] = useState(0);
  const [showTime, setShowTime] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [vehicleAdded, setVehicleAdded] = useState(true);
  const SCREEN_HEIGHT = useWindowDimensions().height;

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    const getAllVehicles = () => {
      if (vehicleAdded) {
        setLoading(true);
        axios
          .get(`${BASE_URL}/vehicle`, {
            timeout: 5000,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then((response) => {
            setVehicles(response?.data ?? []);
          })
          .catch((error) => {
            if (!connectionStatus) {
              setError("No Internet connection!");
            } else if (error?.response) {
              setError(`${error?.response?.data}.`);
            } else if (error?.request) {
              setError("Server not reachable! Can't get your vehicles.");
            } else if (axios.isCancel(error)) {
              console.log(error?.message);
            } else {
              console.log(error);
            }
          })
          .finally(() => {
            setVehicleAdded(false);
            setLoading(false);
          });
      }
    };
    getAllVehicles();
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, [vehicleAdded, connectionStatus]);

  useEffect(() => {
    console.log(
      `Departure Date: ${departureDate}, showTime: ${showTime}, showDate: ${showDate}`
    );
    if (departureDate) {
      console.log("IN");
      console.log(
        `Departure Date: ${departureDate}, showTime: ${showTime}, showDate: ${showDate}`
      );
      showTimePicker();
    }
    console.log(
      `Departure Date: ${departureDate}, showTime: ${showTime}, showDate: ${showDate}`
    );
  }, [departureDate]);

  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.LONG);
  };

  const onChangeTime = (event, selectedTime) => {
    if (event.type === "set") {
      selectedTime.setDate(departureDate.getDate());
      selectedTime.setMonth(departureDate.getMonth());
      selectedTime.setFullYear(departureDate.getFullYear());
      if (selectedTime && selectedTime < new Date()) {
        showToast("Select a time in future!");
      } else if (selectedTime && selectedTime < addMinutes(new Date(), 15)) {
        showToast("Too short! Spare atleast 15 minutes to find you a ride.");
      } else if (
        selectedTime &&
        Math.abs(selectedTime - new Date()) / 36e5 > 12
      ) {
        showToast("Too short! Maximum time span is 12 hours.");
      } else if (selectedTime) {
        setDepartureTime(selectedTime);
      }
      setShowTime(false);
      setDepartureDate(null);
    } else {
      console.log("Cancel Time");
      setShowTime(false);
      setDepartureDate(null);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    if (event.type === "set") {
      setShowDate(false);
      setDepartureDate(selectedDate);
      return;
    }
    setShowDate(false);
  };

  const showTimePicker = () => {
    setShowTime(true);
  };

  const showDatePicker = () => {
    setShowDate(true);
  };

  const formatAMPM = (date) => {
    var hours = date?.getHours();
    var minutes = date?.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var dateString = date?.toLocaleDateString("en-us");
    var strTime = dateString + " " + hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  const getDate = (addDay = 0) => {
    let today = new Date();
    today.setDate(today.getDate() + addDay);
    let dd = String(today.getDate());
    let mm = String(today.getMonth());
    let yyyy = today.getFullYear();
    return new Date(yyyy, mm, dd);
  };

  const postRide = () => {
    setLoading(true);
    const data = {
      pickup_location: {
        coordinates: {
          latitude: source?.coords?.lat,
          longitude: source?.coords?.lng,
        },
        formatted_address: source?.formatted_address,
        place_id: source?.place_id,
      },
      dropoff_location: {
        coordinates: {
          latitude: destination?.coords?.lat,
          longitude: destination?.coords?.lng,
        },
        formatted_address: destination?.formatted_address,
        place_id: destination?.place_id,
      },
      way_points: wayPoints?.map((wayPoint, index) => ({
        coordinates: {
          latitude: wayPoint?.coords?.lat,
          longitude: wayPoint?.coords?.lng,
        },
        formatted_address: wayPoint?.formatted_address,
        place_id: wayPoint?.place_id,
      })),
      overview_polyline: overview_polyline,
      start_time: departureTime,
      vehicle_id: vehicleID,
      no_of_seats: seatsCount,
      same_gender: false,
    };
    console.log(data);
    axios
      .post(`${BASE_URL}/ride/patron/post`, data, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        console?.log(response.data);
        dispatch(setRideID(response?.data?.ride_id));
      })
      .catch((error) => {
        if (!connectionStatus) {
          setError("No Internet connection!");
        } else if (error?.response) {
          setError(`${error?.response?.data}.`);
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        text="Ride Details"
        navigation={() => navigation?.goBack()}
        isBackButtonVisible={true}
      />
      <View style={styles?.timePickerContainer}>
        <Text style={styles?.containerTitle}>When?</Text>
        <View style={styles?.timePickerSubContainer}>
          <View style={styles?.timeDisplayContainer}>
            <Ionicons name="time-outline" size={30} color={"white"} />
            <Text style={styles?.timeText}>{formatAMPM(departureTime)}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                showDatePicker();
              }}
              style={styles?.timeOptionContainer}
            >
              <Text style={styles?.timeOptionText}>Set Custom Time</Text>
            </TouchableOpacity>
          </View>
          {showTime && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode={"time"}
              is24Hour={false}
              display="default"
              onChange={onChangeTime}
            />
          )}
          {showDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode={"date"}
              maximumDate={getDate(1)}
              minimumDate={getDate()}
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>
      </View>
      <View style={styles?.vehicleContainer}>
        <View style={styles?.dropdownVehicle}>
          <Text style={styles?.containerTitle}>Vehicle</Text>
          <DropDownPicker
            schema={{
              label: "name",
              value: "id",
            }}
            style={styles?.dropdown}
            open={vehicleOpen}
            value={vehicleValue}
            items={vehicles}
            setValue={setVehicleValue}
            setItems={setVehicles}
            setOpen={setVehicleOpen}
            placeholder="Select Vehicle"
            placeholderStyle={styles?.placeholderStyles}
            onSelectItem={(item) => {
              setVehicleID(item?.id);
            }}
          />
        </View>
        <TouchableOpacity
          style={styles?.addVehicle}
          onPress={() => {
            setShowDialog(true);
          }}
        >
          <Text style={styles?.addVehicleText}>Add another Vehicle</Text>
          <Ionicons name="add-circle-outline" color={"white"} size={20} />
        </TouchableOpacity>
        <AddVehicleDialog
          setVehicleAdded={setVehicleAdded}
          visible={showDialog}
          setVisibility={setShowDialog}
        />
      </View>
      <View style={styles?.availableSeatsContainer}>
        <Text style={styles?.containerTitle}>Available Seats</Text>
        <View style={styles?.availableSeatsSubContainer}>
          <TouchableOpacity
            onPress={() => {
              if (seatsCount > 1) {
                setSeatsCount(seatsCount - 1);
              }
            }}
          >
            <Ionicons name="remove-circle" color={"#5188E3"} size={40} />
          </TouchableOpacity>
          <Text
            adjustsFontSizeToFit
            style={[
              styles?.availableSeatsCount,
              { fontSize: 0.15 * SCREEN_HEIGHT },
            ]}
          >
            {seatsCount}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (seatsCount < 8) {
                setSeatsCount(seatsCount + 1);
              }
            }}
          >
            <Ionicons name="add-circle" color={"#5188E3"} size={40} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Wait!"}
          errorDescription={error}
          clearError={() => {
            setError("");
          }}
        />
        {/* <View style={styles?.checkboxSection}>
          <Checkbox
            style={styles?.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#5188E3" : undefined}
          />
          <Text style={styles?.checkboxText}>Travel with Same Gender</Text>
        </View> */}
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Button
          text="Post Ride"
          onPress={() => {
            if (!vehicleValue)
              setError("Please, select a vehicle before going forward.");
            else if (departureTime < addMinutes(new Date(), 10))
              showToast(
                "Too short! Spare atleast 15 minutes to find you a ride."
              );
            else postRide();
          }}
        />
      </View>
    </View>
  );
};

export default RideDetails;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  timePickerContainer: {
    marginHorizontal: 15,
    justifyContent: "flex-start",
  },
  timePickerSubContainer: {
    backgroundColor: "#5188E3",
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  timeDisplayContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 5,
  },
  timeOptionContainer: {
    flex: 1,
    height: 30,
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "white",
    borderColor: "#666666",
    marginHorizontal: 15,
    marginBottom: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  timeText: {
    marginStart: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  timeOptionText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  vehicleContainer: {
    marginVertical: 10,
    justifyContent: "center",
  },
  dropdownVehicle: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  addVehicle: {
    backgroundColor: "#5188E3",
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 10,
    paddingStart: 10,
    marginBottom: 10,
  },
  addVehicleText: {
    color: "white",
  },
  availableSeatsContainer: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 15,
    justifyContent: "center",
  },
  containerTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  availableSeatsSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  availableSeatsCount: {
    marginHorizontal: 15,
  },
  checkboxSection: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  checkbox: {
    margin: 8,
  },
  checkboxText: {
    fontFamily: "NunitoSans-SemiBold",
  },
});
