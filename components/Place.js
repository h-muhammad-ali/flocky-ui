import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Place = ({ title, subtitle }) => {
  const [bookmark, setBookmark] = useState(false);
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
      <TouchableOpacity
        style={styles.bookmark}
        onPress={() => {
          setBookmark(!bookmark);
        }}
      >
        <Ionicons name={bookmark ? "bookmark" : "bookmark-outline"} size={25} />
      </TouchableOpacity>
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
  bookmark: {
    alignSelf: "center",
  },
});
