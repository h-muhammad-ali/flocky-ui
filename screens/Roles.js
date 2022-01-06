import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

const Roles = ({ navigation }) => {
  return (
    <View style={styles?.container}>
      <View style={styles?.title}>
        <Text style={styles?.titleText}>Choose your Role</Text>
      </View>
      <View style={styles?.mainBody}>
        <View>
          <TouchableOpacity
            onPress={() => navigation?.navigate("WhereTo", { isPatron: false })}
          >
            <Image
              source={require("../assets/flocky-assets/hitcher.png")}
              style={styles?.image}
            />
            <View style={styles?.imageContainer}>
              <Text style={styles?.roles}>Hitcher</Text>
              <TouchableOpacity>
                <Ionicons name="help-circle" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation?.navigate("WhereTo", { isPatron: true })}
          >
            <Image
              source={require("../assets/flocky-assets/patron.png")}
              style={styles?.image}
            />
            <View style={styles?.imageContainer}>
              <Text style={styles?.roles}>Patron</Text>
              <TouchableOpacity>
                <Ionicons name="help-circle" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Roles;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
    marginTop: Constants?.statusBarHeight,
  },
  image: { width: 150, height: 150, borderRadius: 75 },
  continue: {
    backgroundColor: "#5188E3",
    color: "white",
    textAlign: "center",
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 20,
    fontFamily: "NunitoSans-Regular",
  },
  title: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleText: {
    fontSize: 30,
    fontFamily: "NunitoSans-Regular",
  },
  mainBody: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginStart: 20,
  },
  roles: { fontSize: 25, fontFamily: "Kanit-Light", color: "#5188E3" },
  button: {
    flex: 1,
  },
});
