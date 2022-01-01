import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn";
import MainMenu from "../screens/MainMenu";
import AdminSignUp from "../screens/AdminSignUp";
import UserDrawerNavigator from "./UserDrawerNavigator";
import VerificationFinished from "../screens/VerificationFinished";
import AdminDrawerNavigator from "./AdminDrawerNavigator";

const Stack = createNativeStackNavigator();
const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainMenu"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainMenu" component={MainMenu} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="LogIn" component={SignIn} />
      <Stack.Screen name="AdminSignUp" component={AdminSignUp} />
      <Stack.Screen name="User Panel" component={UserDrawerNavigator} />
      <Stack.Screen name="Admin Panel" component={AdminDrawerNavigator} />
      <Stack.Screen
        name="VerificationFinished"
        component={VerificationFinished}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
