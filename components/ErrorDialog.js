import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "react-native-modal";

const ErrorDialog = ({
  visible,
  errorHeader,
  errorDescription,
  clearError,
}) => {
  const handleOK = () => {
    clearError();
  };
  return (
    <View style={styles?.container}>
      <Modal isVisible={visible}>
        <View style={styles?.modal}>
          <Text style={styles?.header}>{errorHeader}</Text>
          <Text style={styles?.description}>{errorDescription}</Text>
          <TouchableOpacity onPress={handleOK} style={styles?.buttonContainer}>
            <Text style={styles?.buttonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ErrorDialog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  header: {
    fontFamily: "Kanit-Regular",
    color: "#5188E3",
    fontWeight: "600",
    fontSize: 20,
  },
  description: {
    fontFamily: "Kanit-Regular",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontFamily: "NunitoSans-Bold",
  },
  buttonContainer: {
    backgroundColor: "#5188E3",
    marginHorizontal: 90,
    paddingVertical: 10,
    borderRadius: 50,
    marginVertical: 10,
  },
});
