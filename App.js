import React from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigators/StackNavigator";

const App = () => {
  const [loaded] = useFonts({
    "NunitoSans-Regular": require("./assets/fonts/NunitoSans-Regular.ttf"),
    "Kanit-Light": require("./assets/fonts/Kanit-Light.ttf"),
    "Kanit-Medium": require("./assets/fonts/Kanit-Medium.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "NunitoSans-Bold": require("./assets/fonts/NunitoSans-Bold.ttf"),
    "NunitoSans-SemiBold": require("./assets/fonts/NunitoSans-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
