import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Modal from "react-native-modal";

const ConfirmationDialog = ({
  visible,
  heading,
  body,
  positiveHandler,
  negativeHandler,
}) => {
  return (
    <View style={styles?.container}>
      <Modal isVisible={visible}>
        <View style={styles?.modal}>
          <Text style={styles?.header}>{heading}</Text>
          <Text style={styles?.description}>{body}</Text>
          <TouchableOpacity
            onPress={positiveHandler}
            style={styles?.buttonContainer}
          >
            <Text style={styles?.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={negativeHandler}
            style={styles?.buttonContainer}
          >
            <Text style={styles?.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmationDialog;

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
    textAlign: "center",
    marginVertical: 10,
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
