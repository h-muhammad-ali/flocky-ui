import { StyleSheet, Text, View, TouchableOpacity, LogBox } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";

LogBox.ignoreLogs([
  "Warning: Failed prop type: Invalid prop `color` supplied to `Text`:",
]);

const InfoDialog = ({ visible, onDisappear }) => {
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const handleOK = () => {
    onDisappear();
  };
  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);
  return (
    <View style={styles?.container}>
      <Modal isVisible={visible}>
        <View style={styles?.modal}>
          <Text style={[styles?.header, { color: getRandomColor() }]}>
            Miscellaneous Info
          </Text>
          <Text style={styles?.description}>
            Connection Status {"=> "}
            <Text
              style={
                connectionStatus
                  ? styles?.textGlowingGreen
                  : styles?.textGlowingRed
              }
            >
              {connectionStatus ? "available" : "offline"}
            </Text>
          </Text>
          <TouchableOpacity onPress={handleOK} style={styles?.buttonContainer}>
            <Text style={styles?.buttonText}>Disappear!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default InfoDialog;

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
    fontWeight: "600",
    fontSize: 20,
  },
  description: {
    fontFamily: "NunitoSans-Bold",
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "NunitoSans-Bold",
    color: "white",
  },
  buttonContainer: {
    marginHorizontal: 90,
    paddingVertical: 10,
    borderRadius: 50,
    marginVertical: 10,
    backgroundColor: "#5188E3",
  },
  textGlowingGreen: {
    textShadowColor: "rgba(0, 255, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 15,
    color: "green",
  },
  textGlowingRed: {
    textShadowColor: "rgba(255, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 15,
    color: "red",
  },
});
