import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Roles from "../screens/Roles";
import WhereTo from "../screens/WhereTo";
import MatchingRidesHitcher from "../screens/MatchingRidesHitcher";
import PatronDetails from "../screens/PatronDetails";
import HitcherDetails from "../screens/HitcherDetails";
import MatchingRidesPatron from "../screens/MatchingRidesPatron";
import RideRequested from "../screens/RideRequested";
import RidePosted from "../screens/RidePosted";
import RideDetails from "../screens/RideDetails";
import ChatScreen from "../screens/ChatScreen";
import { DrawerActions } from "@react-navigation/native";
import Map from "../screens/Map";
import FullScreenMap from "../screens/FullScreenMap";
import SelectLocation from "../screens/SelectLocation";
import EditProfile from "../screens/EditProfile";
import AddPhoto from "../screens/AddPhoto";
import LiveLocation from "../screens/LiveLocation";
import ResetPassword from "../screens/ResetPassword";
import FullScreenMapForPatron from "../screens/FullScreenMapForPatron";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();
const StackNavigator = ({ navigation }) => {
  const { rideID, role, rideStatus } = useSelector((state) => state?.ride);
  return (
    <Stack.Navigator
      initialRouteName={
        rideID
          ? role === "P"
            ? "RidePosted"
            : "PatronDetailsAfterRideConfirmed"
          : "Roles"
      }
      screenOptions={{ headerShown: false }}
    >
      {!rideID ? (
        <>
          {role === "H" && rideStatus === "W" ? (
            <>
              <Stack.Screen
                name="MatchingRidesHitcher"
                component={MatchingRidesHitcher}
              />
            </>
          ) : (
            <>
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
                          onPress={() => {
                            navigation?.navigate("Admin Tab", {
                              screen: "Admin Panel",
                            });
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
              <Stack.Screen name="SelectLocation" component={SelectLocation} />
              <Stack.Screen name="RideDetails" component={RideDetails} />
              <Stack.Screen name="Map" component={Map} />
              <Stack.Screen name="Full Screen Map" component={FullScreenMap} />
              <Stack.Screen name="Edit Profile" component={EditProfile} />
              <Stack.Screen name="Add Photo" component={AddPhoto} />
              <Stack.Screen name="Reset Password" component={ResetPassword} />
            </>
          )}
        </>
      ) : role === "P" ? (
        <>
          <Stack.Screen name="RidePosted" component={RidePosted} />
          <Stack.Screen
            name="MatchingRidesPatron"
            component={MatchingRidesPatron}
          />
          <Stack.Screen name="HitcherDetails" component={HitcherDetails} />
          <Stack.Screen name="Live Location" component={LiveLocation} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen
            name="Full Screen Map For Patron"
            component={FullScreenMapForPatron}
          />
        </>
      ) : (
        <>
          {/* <Stack.Screen name="RideRequested" component={RideRequested} /> */}
          <Stack.Screen
            name="PatronDetailsAfterRideConfirmed"
            component={PatronDetails}
          />
          <Stack.Screen name="Live Location" component={LiveLocation} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Full Screen Map" component={FullScreenMap} />
        </>
      )}
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
  menuLogo: { marginEnd: 10 },
});
