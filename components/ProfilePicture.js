import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CachedImage from "expo-cached-image";
import { Entypo, Ionicons } from "@expo/vector-icons";

const ProfilePicture = ({
  imageURL,
  size,
  showEdit = false,
  removeMargins = false,
  navigation,
}) => {
  return (
    <View>
      <View
        style={[
          styles?.imageContainer,
          {
            width: size || 100,
            height: size || 100,
            borderRadius: size / 2 || 50,
          },
          !removeMargins && {
            margin: 10,
          },
        ]}
      >
        {imageURL ? (
          <CachedImage
            source={{
              uri: imageURL,
            }}
            cacheKey={`${imageURL?.slice(
              imageURL?.indexOf("%2F") + 3,
              imageURL?.indexOf("?")
            )}`}
            placeholderContent={
              <ActivityIndicator
                color={"#5188E3"}
                size="small"
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              />
            }
            style={styles?.image}
          />
        ) : (
          <Ionicons name="person-circle" size={size} />
        )}
      </View>
      {showEdit ? (
        <TouchableOpacity
          style={styles?.editButton}
          onPress={() => {
            navigation?.navigate("Add Photo", {
              isEdit: true,
              imageURL: imageURL || "",
            });
          }}
        >
          <Entypo name="edit" size={20} color="black" />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default ProfilePicture;

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    aspectRatio: 1 * 1,
    overflow: "hidden",
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 4,
  },
});
