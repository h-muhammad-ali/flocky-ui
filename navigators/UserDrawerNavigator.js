import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer";
import { Ionicons } from "@expo/vector-icons";
import SignUp from "../screens/SignUp";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StackNavigator from "./StackNavigator";
import WallOfHonor from "../screens/WallOfHonor";

const Drawer = createDrawerNavigator();
const UserDrawerNavigator = ({ navigation }) => {
  return (
    <Drawer.Navigator
      initialRouteName="User Panel"
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerIcon: ({ focused, color, size }) => {
          let iconName;

          if (route?.name === "User Panel") {
            iconName = focused ? "md-home" : "md-home-outline";
          } else if (route?.name === "Edit User Profile") {
            iconName = focused ? "account-edit" : "account-edit-outline";
          } else if (route?.name === "Wall of Honor") {
            iconName = focused ? "account-group" : "account-group-outline";
          }

          return route?.name === "User Panel" ? (
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
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="User Panel"
        component={StackNavigator}
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="Edit User Profile"
        component={SignUp}
        initialParams={{ isEdit: true }}
        options={{
          drawerLabel: "Edit Profile",
        }}
      />
      <Drawer.Screen name="Wall of Honor" component={WallOfHonor} />
    </Drawer.Navigator>
  );
};

export default UserDrawerNavigator;
