import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const CompanyCard = ({
  companyName,
  adminName,
  adminEmail,
  forApprove,
  forBlock,
  forUnblock,
  onPress,
}) => {
  return (
    <View style={styles?.container}>
      <Text style={styles?.companyName}>{companyName}</Text>
      <View style={styles?.field}>
        <Text style={styles?.label}>Admin Name:</Text>
        <Text style={styles?.value}>{adminName}</Text>
      </View>
      <View style={styles?.field}>
        <Text style={styles?.label}>Admin Email:</Text>
        <Text style={styles?.value}>{adminEmail}</Text>
      </View>
      {forApprove ? (
        <TouchableOpacity
          style={[styles?.button, { backgroundColor: "#427646" }]}
        >
          <Text style={styles?.buttonText}>Approve</Text>
        </TouchableOpacity>
      ) : forBlock ? (
        <TouchableOpacity
          style={[styles?.button, { backgroundColor: "#C54E57" }]}
        >
          <Text style={styles?.buttonText}>Block</Text>
        </TouchableOpacity>
      ) : forUnblock ? (
        <TouchableOpacity
          style={[styles?.button, { backgroundColor: "#5188E3" }]}
        >
          <Text style={styles?.buttonText}>Unblock</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default CompanyCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  companyName: {
    fontFamily: "Kanit-Medium",
    color: "#5188E3",
    fontSize: 18,
  },
  field: {
    flexDirection: "row",
  },
  label: {
    fontFamily: "NunitoSans-Regular",
  },
  value: {
    fontFamily: "Kanit-Regular",
    color: "#5188E3",
    paddingStart: 5,
    fontSize: 15,
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    paddingVertical: 8,
    textAlign: "center",
  },
});
