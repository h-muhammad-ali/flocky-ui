import React from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigators/StackNavigator";
import UserDrawerNavigator from "./navigators/UserDrawerNavigator";

const App = () => {
  const [loaded] = useFonts({
    "NunitoSans-Regular": require("./assets/fonts/NunitoSans-Regular.ttf"),
    "Kanit-Light": require("./assets/fonts/Kanit-Light.ttf"),
    "Kanit-Medium": require("./assets/fonts/Kanit-Medium.ttf"),
    "Kanit-Regular": require("./assets/fonts/Kanit-Regular.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "NunitoSans-Bold": require("./assets/fonts/NunitoSans-Bold.ttf"),
    "NunitoSans-SemiBold": require("./assets/fonts/NunitoSans-SemiBold.ttf"),
    "Lobster-Regular": require("./assets/fonts/Lobster-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <UserDrawerNavigator />
    </NavigationContainer>
  );
};

export default App;
