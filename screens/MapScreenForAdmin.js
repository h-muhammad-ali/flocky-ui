import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, TextInput, BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Button from "../components/Button";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import { GOOGLE_MAPS_API_KEY } from "@env";
import axios from "axios";
import ErrorDialog from "../components/ErrorDialog";
import { useFocusEffect } from "@react-navigation/native";
import CompanySelectionMap from "../components/CompanySelectionMap";
import { setCompanyLocation } from "../redux/companyLocation/companyLocationActions";

const MapScreenForAdmin = ({ navigation, route }) => {
  const { location } = useSelector((state) => state?.companyLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef(null);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        dispatch(setCompanyLocation(null));
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
  useEffect(() => {
    if (location !== "" && ref?.current) {
      ref?.current?.setNativeProps({
        borderColor: "#B7B7B7",
      });
    }
  }, [location]);
  return (
    <View style={styles?.container}>
      <Header
        text="Company's Location"
        navigation={() => {
          dispatch(setCompanyLocation(null));
          navigation?.goBack();
        }}
        isBackButtonVisible={true}
      />
      <View
        style={[
          styles?.input,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          },
        ]}
      >
        <TextInput
          ref={ref}
          value={location?.short_address}
          style={{
            fontSize: 15,
            height: 45,
            flex: 1,
            marginEnd: 5,
          }}
          selectionColor={"#5188E3"}
          placeholder="City, town, address or place"
          onPressOut={() =>
            navigation?.navigate("SelectOrganizationLocation", {
              origin: "CompanyLocation",
            })
          }
          showSoftInputOnFocus={false}
        />
      </View>

      <CompanySelectionMap />
      <Button
        text={"Continue"}
        onPress={() => {
          if (location === null && ref.current) {
            ref.current.setNativeProps({
              borderColor: "red",
            });
          } else {
            navigation?.navigate("AdminSignUp", {
              origin: "CompanyLocation",
              company: route.params?.company,
              password: route.params?.password,
              email: route.params?.email,
              domain: route.params?.domain,
            });
          }
        }}
      />
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Error"}
          errorDescription={error}
          clearError={() => {
            setError("");
          }}
        />
      </View>
    </View>
  );
};

export default MapScreenForAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    fontFamily: "NunitoSans-SemiBold",
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlignVertical: "center",
  },
  waypoint: {
    backgroundColor: "#5188E3",
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: 10,
    paddingStart: 10,
  },
  waypointText: {
    color: "white",
  },
});
