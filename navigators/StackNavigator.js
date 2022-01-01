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
import Sign from "../screens/SignUp";
import SignIn from "../screens/SignIn";
import RideRequested from "../screens/RideRequested";
import RidePosted from "../screens/RidePosted";
import RideDetails from "../screens/RideDetails";
import ChatScreen from "../screens/ChatScreen";
import AdminTabNavigator from "../navigators/AdminTabNavigator";
import MainMenu from "../screens/MainMenu";
import AdminSignUp from "../screens/AdminSignUp";
import VerificationFinished from "../screens/VerificationFinished";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainMenu"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="SignUp" component={Sign} />
      <Stack.Screen name="LogIn" component={SignIn} />
      <Stack.Screen
        name="Roles"
        component={Roles}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerBackVisible: false,
          headerRight: (props) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {route.params?.isAdmin ? (
                <TouchableOpacity
                  style={{ marginEnd: 15 }}
                  onPress={() => {
                    navigation?.navigate("AdminPanel");
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
                  navigation?.navigate("LogIn");
                }}
              >
                <Ionicons name="log-out-outline" size={30} />
              </TouchableOpacity>
            </View>
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
      <Stack.Screen name="AdminSignUp" component={AdminSignUp} />
      <Stack.Screen name="AdminPanel" component={AdminTabNavigator} />
      <Stack.Screen
        name="VerificationFinished"
        component={VerificationFinished}
      />
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
});
