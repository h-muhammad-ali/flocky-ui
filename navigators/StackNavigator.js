import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Roles from "../screens/Roles";
import WhereToHitcher from "../screens/WhereToHitcher";
import HitcherSource from "../screens/HitcherSource";
import MatchingRidesHitcher from "../screens/MatchingRidesHitcher";
import PatronDetails from "../screens/PatronDetails";
import HitcherDetails from "../screens/HitcherDetails";
import MatchingRidesPatron from "../screens/MatchingRidesPatron";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Roles"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Roles" component={Roles} />
      <Stack.Screen name="WhereToHitcher" component={WhereToHitcher} />
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
    </Stack.Navigator>
  );
};

export default StackNavigator;
