import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PendingRequests from "../screens/PendingRequests";
import Companies from "../screens/Companies";
import BlockedCompanies from "../screens/BlockedCompanies";

const Tab = createBottomTabNavigator();

const CompaniesManagementTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginEnd: 15 }}
              onPress={() => {
                navigation?.navigate("MainMenu");
              }}
            >
              <Ionicons name="exit-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerTitle: () => <Text style={styles?.heading}>{route?.name}</Text>,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route?.name === "Pending Requests") {
            return (
              <MaterialIcons name="pending-actions" size={size} color={color} />
            );
          } else if (route?.name === "Companies") {
            return <FontAwesome name="institution" size={size} color={color} />;
          } else if (route?.name === "Blocked Companies") {
            iconName = focused ? "remove-circle" : "remove-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#5188E3",
        tabBarActiveBackgroundColor: "#5188E3",
        tabBarInactiveBackgroundColor: "#E0E0E0",
      })}
    >
      <Tab.Screen name="Pending Requests" component={PendingRequests} />
      <Tab.Screen name="Companies" component={Companies} />
      <Tab.Screen name="Blocked Companies" component={BlockedCompanies} />
    </Tab.Navigator>
  );
};

export default CompaniesManagementTabNavigator;

const styles = StyleSheet?.create({
  heading: {
    color: "#5188E3",
    fontFamily: "Kanit-Medium",
    fontSize: 20,
  },
  menuLogo: { paddingStart: 10 },
});
