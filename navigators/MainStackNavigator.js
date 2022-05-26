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
import SelectLocation from "../screens/SelectLocation";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

const Stack = createNativeStackNavigator();
const MainStackNavigator = () => {
  const { jwt } = useSelector((state) => state?.currentUser);
  let decoded;
  if (jwt) {
    decoded = jwt_decode(jwt);
    console?.log(decoded);
  }
  return (
    <Stack.Navigator
      initialRouteName={
        jwt ? (decoded?.is_admin ? "Admin Tab" : "User Stack") : "MainMenu"
      }
      screenOptions={{
        headerShown: false,
      }}
    >
      {jwt ? (
        <>
          {decoded?.is_admin ? (
            <>
              <Stack.Screen name="Admin Tab" component={AdminDrawerNavigator} />
              <Stack.Screen name="User Stack" component={UserDrawerNavigator} />
            </>
          ) : decoded?.is_flocky_admin ? (
            <>
              <Stack.Screen
                name="Companies Management"
                component={CompaniesManagementTabNavigator}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="User Stack" component={UserDrawerNavigator} />
            </>
          )}
        </>
      ) : (
        <>
          <Stack.Screen name="MainMenu" component={MainMenu} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="LogIn" component={SignIn} />
          <Stack.Screen
            name="Company Registeration"
            component={CompanyRegisteration}
          />
          <Stack.Screen name="Forgot Password" component={ForgotPassword} />
          <Stack.Screen name="AdminSignUp" component={AdminSignUp} />
          <Stack.Screen
            name="VerificationFinished"
            component={VerificationFinished}
          />
          <Stack.Screen name="Add Photo" component={AddPhoto} />
          <Stack.Screen name="AddCode" component={AddCode} />
          <Stack.Screen name="Reset Password" component={ResetPassword} />
          <Stack.Screen
            name="SelectOrganizationLocation"
            component={SelectLocation}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
