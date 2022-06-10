import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HitcherCard = ({ name, onPress }) => {
  return (
    <View style={styles?.container}>
      <Text style={styles?.notification}>
        <Text style={styles?.name}>{name}</Text> appeard to ride with you.
      </Text>
      <View style={styles?.showDetailsButton}>
        <TouchableOpacity onPress={onPress} style={{ flexDirection: "row" }}>
          <Text style={styles?.showDetailsText}>Show Details</Text>
          <Ionicons name="arrow-forward" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HitcherCard;

const styles = StyleSheet?.create({
  container: {
    backgroundColor: "#E5E5E5",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  notification: {
    fontFamily: "NunitoSans-SemiBold",
  },
  showDetailsText: {
    color: "#5188E3",
    marginEnd: 5,
  },
  showDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  name: {
    color: "#5188E3",
    fontFamily: "NunitoSans-SemiBold",
  },
});
