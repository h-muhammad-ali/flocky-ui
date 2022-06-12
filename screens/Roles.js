import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import InfoDialog from "../components/InfoDialog";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../redux/ride/rideActions";
import { resetLocationState } from "../redux/locations/locationsActions";
import { useFocusEffect } from "@react-navigation/native";
import ErrorDialog from "../components/ErrorDialog";

const Roles = ({ navigation }) => {
  const dispatch = useDispatch();
  const { source, destination, wayPoints, overview_polyline } = useSelector(
    (state) => state?.locations
  );
  const [hitcherTip, setHitcherTip] = useState(false);
  const [patronTip, setPatronTip] = useState(false);
  const [secret, showSecret] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      if (
        source !== null ||
        destination !== null ||
        wayPoints?.length !== 0 ||
        overview_polyline !== ""
      ) {
        dispatch(resetLocationState());
      }
    }, [])
  );
  return (
    <View style={styles?.container}>
      <View style={styles?.title}>
        <Text style={styles?.titleText}>
          Choo<Text onPress={() => showSecret(true)}>s</Text>e your Role
        </Text>
      </View>
      <View style={styles?.mainBody}>
        <View>
          <TouchableOpacity
            onPress={() => {
              dispatch(setRole("H"));
              navigation?.navigate("WhereTo", { isPatron: false });
            }}
          >
            <Image
              source={require("../assets/flocky-assets/hitcher.png")}
              style={styles?.image}
            />
            <View style={styles?.imageContainer}>
              <Text style={styles?.roles}>Hitcher</Text>
              <TouchableOpacity
                onPress={() =>
                  setHitcherTip(
                    "A user who wants to avail a free ride from his colleagues."
                  )
                }
              >
                <Ionicons name="help-circle" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              dispatch(setRole("P"));
              navigation?.navigate("WhereTo", { isPatron: true });
            }}
          >
            <Image
              source={require("../assets/flocky-assets/patron.png")}
              style={styles?.image}
            />
            <View style={styles?.imageContainer}>
              <Text style={styles?.roles}>Patron</Text>
              <TouchableOpacity
                onPress={() =>
                  setPatronTip(
                    "A user who is willing to offer his conveyance to commute along with his colleagues."
                  )
                }
              >
                <Ionicons name="help-circle" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <ErrorDialog
          visible={!!patronTip || !!hitcherTip}
          errorHeader={!!hitcherTip ? "A Hitcher..." : "A Patron..."}
          errorDescription={!!hitcherTip ? hitcherTip : patronTip}
          clearError={() => {
            !!hitcherTip ? setHitcherTip("") : setPatronTip("");
          }}
          buttonText={"Got it!"}
        />
        <InfoDialog
          visible={secret}
          onDisappear={() => {
            showSecret(false);
          }}
        />
      </View>
    </View>
  );
};

export default Roles;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
    marginTop: Constants?.statusBarHeight,
  },
  image: { width: 150, height: 150, borderRadius: 75 },
  continue: {
    backgroundColor: "#5188E3",
    color: "white",
    textAlign: "center",
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 20,
    fontFamily: "NunitoSans-Regular",
  },
  title: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleText: {
    fontSize: 30,
    fontFamily: "NunitoSans-Regular",
  },
  mainBody: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginStart: 20,
  },
  roles: { fontSize: 25, fontFamily: "Kanit-Light", color: "#5188E3" },
  button: {
    flex: 1,
  },
});
