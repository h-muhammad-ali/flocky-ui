import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { FontAwesome5 } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

const BackgroundPermissionModal = ({
  visible,
  forPatron,
  positiveHandler,
  negativeHandler,
}) => {
  return (
    <View style={styles?.container}>
      <Modal isVisible={visible}>
        <View style={styles?.modal}>
          <Text style={styles?.header}>
            We'll need Background Location Permission to track your location. Is
            is OK if we ask you to enable it?
          </Text>
          <View style={styles?.vector}>
            <FontAwesome5
              name="map-marked-alt"
              size={SCREEN_WIDTH / 3}
              color="black"
            />
          </View>
          <Text style={styles?.description}>
            If you enable{" "}
            <Text style={styles?.highlight}>Location Services</Text>,{" "}
            {forPatron ? (
              <Text>your matched hitchers</Text>
            ) : (
              <Text>your matched patron</Text>
            )}{" "}
            can see your live location, so you can meet fast and easily - even
            if your app is in the background. Otherwise, you have to keep the
            app open to send your real-time coordinates to the{" "}
            {forPatron ? <Text>Hitcher</Text> : <Text>Patron</Text>}.
          </Text>
          <Text style={styles?.description}>
            To enable Background Location Permission: Click{" "}
            <Text style={styles?.highlight}>Go to Setting</Text> below and then
            select <Text style={styles?.highlight}>Allow all the time</Text>.
          </Text>
          <TouchableOpacity
            onPress={positiveHandler}
            style={styles?.buttonContainer}
          >
            <Text style={styles?.buttonText}>Go to Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={negativeHandler}
            style={styles?.buttonContainer}
          >
            <Text style={styles?.buttonText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default BackgroundPermissionModal;

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
  vector: {
    alignItems: "center",
    justifyContent: "center",
  },
  highlight: { color: "#5188E3", fontWeight: "bold" },
});
