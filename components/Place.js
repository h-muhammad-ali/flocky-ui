import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Place = ({ title, subtitle }) => {
  return (
    <View style={styles?.container}>
      <View>
        <Text numberOfLines={1} style={styles?.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles?.subtitle}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export default Place;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#999595",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 16,
  },
  subtitle: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 14,
    color: "#999999",
  },
});
