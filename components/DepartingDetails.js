import React from "react";
import { StyleSheet, Text, View } from "react-native";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

const DepartingDetails = ({ showDate, time, style }) => {
  return (
    <View style={[styles?.container, style]}>
      <Text style={styles?.title}>Departing</Text>
      <View style={styles.subContainer}>
        {showDate ? (
          <View style={styles?.portion}>
            <Ionicons name="calendar-outline" size={20} color={"#5188E3"} />
            <Text style={styles?.text}>{moment().format("MMMM DD, YYYY")}</Text>
          </View>
        ) : (
          <></>
        )}
        <View style={styles?.portion}>
          <Ionicons name="time-outline" size={20} color={"#5188E3"} />
          <Text style={styles?.text}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default DepartingDetails;

const styles = StyleSheet.create({
  title: {
    fontFamily: "NunitoSans-Bold",
    textDecorationLine: "underline",
  },
  container: {
    marginHorizontal: 15,
    marginBottom: 5,
  },
  subContainer: {
    flexDirection: "row",
    marginStart: 15,
    marginVertical: 5,
  },
  text: {
    marginStart: 5,
    fontFamily: "NunitoSans-SemiBold",
  },
  portion: { flexDirection: "row", flex: 1, alignItems: "center" },
});
