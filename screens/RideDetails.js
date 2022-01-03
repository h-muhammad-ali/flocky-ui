import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AddVehicleDialog from "../components/AddVehicleDialog";
import Button from "../components/Button";

const RideDetails = ({ navigation }) => {
  const dummyVehicleDetails = [
    {
      id: 1,
      model: "CR-V",
      make: "Honda",
      plateNumber: "LXW 1234",
      color: "Red",
      year: "2017",
      type: "car",
      name: "Honda CR-V",
    },
    {
      id: 2,
      model: "CR-V",
      make: "Honda",
      plateNumber: "LXW 1234",
      color: "Red",
      year: "2017",
      type: "car",
      name: "Honda CR-V",
    },
    {
      id: 3,
      model: "CR-V",
      make: "Honda",
      plateNumber: "LXW 1234",
      color: "Red",
      year: "2017",
      type: "car",
      name: "Honda CR-V",
    },
    {
      id: 4,
      model: "CR-V",
      make: "Honda",
      plateNumber: "LXW 1234",
      color: "Red",
      year: "2017",
      type: "car",
      name: "Honda CR-V",
    },
  ];
  const [time, setTime] = useState(new Date(Date.now()));
  const [seatsCount, setSeatsCount] = useState(1);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicleValue, setVehicleValue] = useState(null);
  const [vehicle, setVehicle] = useState(dummyVehicleDetails);
  const [show, setShow] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShow(false);
    setTime(currentTime);
  };

  const showTimePicker = () => {
    setShow(true);
  };

  function formatAMPM(date) {
    var hours = date?.getHours();
    var minutes = date?.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  return (
    <View style={styles?.container}>
      <Header text="Ride Details" navigation={() => navigation?.goBack()} />
      <View style={styles?.timePickerContainer}>
        <Text style={styles?.containerTitle}>When?</Text>
        <View style={styles?.timePickerSubContainer}>
          <View style={styles?.timeDisplayContainer}>
            <Ionicons name="time-outline" size={30} color={"white"} />
            <Text style={styles?.timeText}>{formatAMPM(time)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setTime(new Date(Date.now()));
            }}
            style={styles?.timeOptionContainer}
          >
            <Text style={styles?.timeOptionText}>Right Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showTimePicker();
            }}
            style={styles?.timeOptionContainer}
          >
            <Text style={styles?.timeOptionText}>Set Custom Time</Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={time}
              mode={"time"}
              is24Hour={false}
              display="default"
              onChange={onChange}
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
            items={vehicle}
            setValue={setVehicleValue}
            setItems={setVehicle}
            setOpen={setVehicleOpen}
            placeholder="Select Vehicle"
            placeholderStyle={styles?.placeholderStyles}
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
        <AddVehicleDialog visible={showDialog} setVisibility={setShowDialog} />
      </View>
      <View style={styles?.availableSeatsContainer}>
        <Text style={styles?.containerTitle}>Available Seats</Text>
        <View style={styles?.availableSeatsSubContainer}>
          <TouchableOpacity
            onPress={() => {
              if (seatsCount < 8) {
                setSeatsCount(seatsCount + 1);
              }
            }}
          >
            <Ionicons name="add-circle" color={"#5188E3"} size={50} />
          </TouchableOpacity>
          <Text style={styles?.availableSeatsCount}>{seatsCount}</Text>
          <TouchableOpacity
            onPress={() => {
              if (seatsCount > 1) {
                setSeatsCount(seatsCount - 1);
              }
            }}
          >
            <Ionicons name="remove-circle" color={"#5188E3"} size={50} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Button
          text="Post Ride"
          onPress={() => {
            navigation?.navigate("RidePosted");
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
  timeOptionContainer: {
    width: "50%",
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#E0E0E0",
    borderColor: "#666666",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  timeOptionText: {
    textAlign: "center",
    fontWeight: "bold",
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
    marginBottom: 25,
  },
  addVehicleText: {
    color: "white",
  },
  timePickerContainer: { marginHorizontal: 15, flex: 1 },
  timePickerSubContainer: {
    backgroundColor: "#5188E3",
    borderRadius: 20,
    paddingVertical: 20,
    marginVertical: 10,
  },
  timeDisplayContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 5,
  },
  timeText: {
    marginStart: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  vehicleContainer: {
    marginVertical: 20,
    height: "20%",
    justifyContent: "center",
  },
  availableSeatsContainer: { marginHorizontal: 15, flex: 1 },
  containerTitle: {
    fontWeight: "bold",
  },
  availableSeatsSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  availableSeatsCount: { fontSize: 100, marginHorizontal: 15 },
});
