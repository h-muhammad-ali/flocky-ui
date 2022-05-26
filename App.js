import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./navigators/MainStackNavigator";
import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  registerNetworkStatusListener,
  unregisterNetworkStatusListener,
} from "./redux/internetStatus/internetStatusActions";
import { useDispatch } from "react-redux";

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(registerNetworkStatusListener());
    return () => unregisterNetworkStatusListener();
  }, []);

  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
};

export default AppWrapper;
