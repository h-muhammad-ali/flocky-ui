import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

const CustomDrawer = (props) => {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.headerContainer}>
          <Ionicons name="person-circle" size={100} />
          <Text style={[styles?.headerText, { fontSize: 30 }]}>John Doe</Text>
          <Text style={styles?.headerText}>Total Rides: 75</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        style={styles.logout}
        labelStyle={styles.logoutText}
        label="Logout"
        onPress={() => props?.navigation?.navigate("LogIn")}
        icon={({ focused, color, size }) => (
          <Ionicons color={color} size={size} name="exit" />
        )}
      />
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#5188E3",
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    marginHorizontal: 10,
  },
  logout: {
    backgroundColor: "#C54E57",
  },
  logoutText: {
    color: "white",
  },
});
