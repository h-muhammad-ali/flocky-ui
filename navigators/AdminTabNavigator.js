import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminNotifications from "../screens/AdminNotifications";
import AdminUsers from "../screens/AdminUsers";
import AdminBlockedUsers from "../screens/AdminBlockedUsers";
import { DrawerActions } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const AdminTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ marginEnd: 15 }}
              onPress={() => {
                navigation?.reset({
                  index: 0,
                  routes: [{ name: "User Stack" }],
                });
                // navigation?.navigate("User Stack", {
                //   screen: "User Panel",
                //   params: {
                //     screen: "Roles",
                //     params: { isAdmin: true },
                //   },
                // });
              }}
            >
              <MaterialCommunityIcons
                name="account-switch-outline"
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            style={styles.menuLogo}
            onPress={() => {
              navigation?.dispatch(DrawerActions?.toggleDrawer());
            }}
          >
            <Ionicons name="menu-sharp" size={30} color="#5188E3" />
          </TouchableOpacity>
        ),
        headerTitle: () => <Text style={styles?.heading}>{route?.name}</Text>,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route?.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route?.name === "Users") {
            iconName = focused ? "people" : "people-outline";
          } else if (route?.name === "Blocked Users") {
            iconName = focused ? "remove-circle" : "remove-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#5188E3",
        tabBarActiveBackgroundColor: "#5188E3",
        tabBarInactiveBackgroundColor: "#E0E0E0",
      })}
    >
      <Tab.Screen
        name="Notifications"
        options={{ unmountOnBlur: true }}
        component={AdminNotifications}
      />
      <Tab.Screen
        name="Users"
        options={{ unmountOnBlur: true }}
        component={AdminUsers}
      />
      <Tab.Screen
        name="Blocked Users"
        options={{ unmountOnBlur: true }}
        component={AdminBlockedUsers}
      />
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
  menuLogo: { paddingStart: 10 },
});
