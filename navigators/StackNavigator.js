import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Roles from "../screens/Roles";
import WhereTo from "../screens/WhereTo";
import HitcherSource from "../screens/HitcherSource";
import MatchingRidesHitcher from "../screens/MatchingRidesHitcher";
import PatronDetails from "../screens/PatronDetails";
import HitcherDetails from "../screens/HitcherDetails";
import MatchingRidesPatron from "../screens/MatchingRidesPatron";
import RideRequested from "../screens/RideRequested";
import RidePosted from "../screens/RidePosted";
import RideDetails from "../screens/RideDetails";
import ChatScreen from "../screens/ChatScreen";
import { DrawerActions } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Roles"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Roles"
        component={Roles}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerBackVisible: false,
          headerRight: () => (
            <View style={styles?.headerRight}>
              {route.params?.isAdmin ? (
                <TouchableOpacity
                  style={styles?.adminPanelLogo}
                  onPress={() => {
                    navigation?.navigate("Admin Panel");
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-switch-outline"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <TouchableOpacity
                onPress={() => {
                  navigation?.navigate("MainMenu");
                }}
              >
                <Ionicons name="log-out-outline" size={30} />
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
          headerTitle: () => (
            <Text style={styles?.heading}>Welcome to Flocky!</Text>
          ),
        })}
      />
      <Stack.Screen name="WhereTo" component={WhereTo} />
      <Stack.Screen name="HitcherSource" component={HitcherSource} />
      <Stack.Screen
        name="MatchingRidesHitcher"
        component={MatchingRidesHitcher}
      />
      <Stack.Screen name="PatronDetails" component={PatronDetails} />
      <Stack.Screen name="HitcherDetails" component={HitcherDetails} />
      <Stack.Screen
        name="MatchingRidesPatron"
        component={MatchingRidesPatron}
      />
      <Stack.Screen name="RideRequested" component={RideRequested} />
      <Stack.Screen name="RidePosted" component={RidePosted} />
      <Stack.Screen name="RideDetails" component={RideDetails} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
const styles = StyleSheet?.create({
  heading: {
    color: "#5188E3",
    fontFamily: "Kanit-Medium",
    fontSize: 20,
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  adminPanelLogo: { marginEnd: 15 },
  menuLogo: { marginEnd: 10 },
});
