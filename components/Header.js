import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const Header = ({
  text,
  navigation,
  isCancel,
  onCancel,
  isBackButtonVisible,
}) => {
  return (
    <View style={styles?.container}>
      {isBackButtonVisible ? (
        <TouchableOpacity style={styles?.backArrow} onPress={navigation}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
      ) : (
        <>
          <View style={{ marginLeft: 30 }}></View>
        </>
      )}

      <View style={styles?.title}>
        <Text
          style={[
            styles?.titleText,
            isCancel ? { marginRight: -15 } : { marginRight: 40 },
          ]}
        >
          {text}
        </Text>
      </View>

      {isCancel ? (
        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    marginTop: Constants.statusBarHeight,
    marginBottom: 20,
  },
  backArrow: {
    marginLeft: 10,
  },
  title: {
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  titleText: { fontFamily: "NunitoSans-Bold" },
  cancel: {
    alignSelf: "center",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: "red",
    fontFamily: "NunitoSans-Bold",
  },
});

export default Header;
