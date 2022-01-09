import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AdminTabNavigator from "./AdminTabNavigator";
import AdminSignUp from "../screens/AdminSignUp";
import WallOfHonor from "../screens/WallOfHonor";

const Drawer = createDrawerNavigator();
const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Admin Panel"
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerIcon: ({ focused, color, size }) => {
          let iconName;

          if (route?.name === "Admin Panel") {
            iconName = focused ? "md-home" : "md-home-outline";
          } else if (route?.name === "Edit Admin Profile") {
            iconName = focused ? "account-edit" : "account-edit-outline";
          } else if (route?.name === "Wall of Honor") {
            iconName = focused ? "account-group" : "account-group-outline";
          }

          return route?.name === "Admin Panel" ? (
            <Ionicons name={iconName} size={size} color={color} />
          ) : (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "#5188E3",
        drawerActiveBackgroundColor: "#5188E3",
        drawerInactiveBackgroundColor: "#E0E0E0",
      })}
      drawerContent={(props) => <CustomDrawer {...props} isAdmin={true} />}
    >
      <Drawer.Screen
        name="Admin Panel"
        component={AdminTabNavigator}
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen name="Wall of Honor" component={WallOfHonor} />
    </Drawer.Navigator>
  );
};

export default AdminDrawerNavigator;
