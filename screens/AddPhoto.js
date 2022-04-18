import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import { getStorage, getDownloadURL } from "firebase/storage";

const storage = getStorage();
const AddPhoto = ({ navigation, route }) => {
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker?.launchImageLibraryAsync({
      mediaTypes: ImagePicker?.MediaTypeOptions?.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result?.cancelled) {
      setImage(result?.uri);
    }
  };
  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr?.response);
      };
      xhr.onerror = function (e) {
        console?.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const ref = storage().ref().child(`/userProfileImages/${Date?.now()}`);
    const uploadTask = ref.put(blob);
    uploadTask?.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot?.bytesTransferred / snapshot?.totalBytes) * 100;
        console?.log("Upload is " + progress + "% done");
      },
      (error) => {
        alert("Error in uploading image");
      },
      () => {
        blob.close();
        getDownloadURL(uploadTask?.snapshot?.ref).then((downloadURL) => {
          console?.log("File available at", downloadURL);
        });
      }
    );
  }
  const logInOnPressHandler = () => {
    const dataObj = { ...route?.params?.userData, imageURI: image };
    // signInAnonymously(auth)
    //   .then(() => {
    //     console?.log("SignIn")
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console?.log(errorCode, errorMessage);
    //   });
    navigation?.navigate("LogIn");
  };
  return (
    <View style={styles?.container}>
      <View style={styles?.subContainer}>
        <Text style={styles?.title}>
          {route.params?.isEdit ? "Change" : "Add"} your Photo
        </Text>
        {route.params?.isEdit ? (
          <></>
        ) : (
          <Text style={styles?.subtitle}>
            Helps Patrons and Hitchers to Identify Rides
          </Text>
        )}
        {image ? (
          <View style={styles?.imageContainer}>
            <Image source={{ uri: image }} style={styles?.image} />
          </View>
        ) : (
          <Ionicons name="person-circle" size={200} />
        )}
        <TouchableOpacity style={styles?.addPhotoContainer} onPress={pickImage}>
          <Text style={styles?.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles?.skipContainer}
          onPress={() => {
            setImage(null);
          }}
        >
          <Text style={styles?.skipText}>Remove Photo</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Button
          isDisabled={!image}
          text={route.params?.isEdit ? "Update Photo" : "Continue"}
          onPress={
            route.params?.isEdit
              ? () => {}
              : route.params?.isAdmin
              ? () => {
                  navigation?.navigate("VerificationFinished");
                }
              : () => {
                  logInOnPressHandler();
                }
          }
        />
        <TouchableOpacity
          style={styles?.skipContainer}
          onPress={
            route.params?.isEdit
              ? () => {}
              : route.params?.isAdmin
              ? () => {
                  navigation?.navigate("VerificationFinished");
                }
              : () => {
                  navigation?.navigate("LogIn");
                }
          }
        >
          <Text style={styles?.skipText}>Skip this step</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddPhoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  title: {
    textDecorationLine: "underline",
    fontFamily: "NunitoSans-Regular",
    fontSize: 30,
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
  },
  subContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoContainer: {
    backgroundColor: "#5188E3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  addPhotoText: {
    color: "white",
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    aspectRatio: 1 * 1,
    width: 180,
    height: 180,
    overflow: "hidden",
    borderRadius: 100,
    marginVertical: 15,
  },
  skipText: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "grey",
  },
  skipContainer: { alignSelf: "center" },
});
