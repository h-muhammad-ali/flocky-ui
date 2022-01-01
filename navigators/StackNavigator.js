import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
      <Stack.Screen name="Roles" component={Roles} />
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
      <Stack.Screen name="AdminPanel" component={AdminTabNavigator} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
