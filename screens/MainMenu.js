import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import Constants from "expo-constants";

const MainMenu = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  return (
    <View style={styles?.container}>
      <View style={styles?.header}>
        <Image
          source={require("../assets/flocky-assets/logo.png")}
          style={{ width: 130, height: 100 }}
        />
        <Text style={styles?.title}>Flocky</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/flocky-assets/mainmenu.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles?.menuItemButton}
          onPress={() => {
            navigation?.navigate("SignUp");
          }}
        >
          <Text style={styles?.menuItemsButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles?.menuItemButton}
          onPress={() => {
            navigation?.navigate("LogIn");
          }}
        >
          <Text style={styles?.menuItemsButtonText}>I have an Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles?.menuItemLink}
          onPress={() => {
            navigation?.navigate("Company Registeration");
          }}
        >
          <Text style={styles?.menuItemLinkText}>Register your Company</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#F8F9FE",
    justifyContent: "space-between",
  },
  menu: {
    backgroundColor: "#5188E3",
    flex: 1,
    justifyContent: "center",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingVertical: 30,
  },
  menuItemsButtonText: {
    color: "#5188E3",
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
  },
  menuItemButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    marginHorizontal: 40,
    marginVertical: 8,
    borderRadius: 30,
  },
  menuItemLink: {
    alignSelf: "center",
    marginVertical: 30,
  },
  menuItemLinkText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontFamily: "Kanit-Regular",
    textDecorationLine: "underline",
  },
  title: {
    fontFamily: "Lobster-Regular",
    fontSize: 48,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: { flex: 1, aspectRatio: 1 * 1, alignSelf: "center" },
  image: { resizeMode: "cover", width: "100%", height: "100%" },
});
