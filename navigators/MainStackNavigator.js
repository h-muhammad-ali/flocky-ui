import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn";
import MainMenu from "../screens/MainMenu";
import UserDrawerNavigator from "./UserDrawerNavigator";
import VerificationFinished from "../screens/VerificationFinished";
import AdminDrawerNavigator from "./AdminDrawerNavigator";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";
import AddPhoto from "../screens/AddPhoto";
import CompanyRegisteration from "../screens/CompanyRegisteration";
import AdminSignUp from "../screens/AdminSignUp";
import CompaniesManagementTabNavigator from "./CompaniesManagementTabNavigator";
import AddCode from "../screens/AddCode";

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
      <Stack.Screen
        name="Company Registeration"
        component={CompanyRegisteration}
      />
      <Stack.Screen name="User Stack" component={UserDrawerNavigator} />
      <Stack.Screen name="Admin Tab" component={AdminDrawerNavigator} />
      <Stack.Screen name="AdminSignUp" component={AdminSignUp} />
      <Stack.Screen
        name="VerificationFinished"
        component={VerificationFinished}
      />
      <Stack.Screen name="Forgot Password" component={ForgotPassword} />
      <Stack.Screen name="Reset Password" component={ResetPassword} />
      <Stack.Screen name="Add Photo" component={AddPhoto} />
      <Stack.Screen
        name="Companies Management"
        component={CompaniesManagementTabNavigator}
      />
      <Stack.Screen name="AddCode" component={AddCode} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
