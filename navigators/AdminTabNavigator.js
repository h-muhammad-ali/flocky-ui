import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminNotifications from "../screens/AdminNotifications";
import AdminUsers from "../screens/AdminUsers";

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => (
          <TouchableOpacity style={{ marginEnd: 10 }}>
            <Ionicons name="log-out-outline" size={30} />
          </TouchableOpacity>
        ),
        headerTitle: (props) => (
          <Text style={styles?.heading}>{route?.name}</Text>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route?.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route?.name === "Users") {
            iconName = focused ? "people" : "people-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#5188E3",
        tabBarActiveBackgroundColor: "#5188E3",
        tabBarInactiveBackgroundColor: "#E0E0E0",
      })}
    >
      <Tab.Screen name="Notifications" component={AdminNotifications} />
      <Tab.Screen name="Users" component={AdminUsers} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;

const styles = StyleSheet?.create({
  heading: {
    color: "#5188E3",
    fontFamily: "Kanit-Medium",
    fontSize: 20,
  },
});
