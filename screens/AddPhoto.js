import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import { getStorage, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";

const storage = getStorage();
const AddPhoto = ({ navigation, route }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { jwt } = useSelector((state) => state?.currentUser);
  const showToast = () => {
    ToastAndroid.show("User info updated successfully!", ToastAndroid?.LONG);
  };
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
  const editData = (updatedData) => {
    setLoading(true);
    axios
      .put(`${BASE_URL}/account/user/details/update`, updatedData, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        showToast();
        navigation?.navigate("Roles");
      })
      .catch((error) => {
        console?.log(error);
        if (error?.response) {
          setError(
            `${error?.response?.data}. Status Code: ${error?.response?.status}`
          );
        } else if (error?.request) {
          setError("Network Error! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const uploadOnPressHandler = () => {
    const dataObj = { imageURI: image };

    // here upload the image on firebase and save/update the returned link in database via api.
    // if image is not updated by the user, dont call api for no reason!

    if (route.params?.isEdit) editData(route.params?.updatedData);
    if (!route.params?.isEdit) navigation?.navigate("LogIn");
  };

  useEffect(() => {
    if (route.params?.isEdit) setImage(route.params?.imageURL);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
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
              ? () => {
                  uploadOnPressHandler();
                }
              : route.params?.isAdmin
              ? () => {
                  navigation?.navigate("VerificationFinished");
                }
              : () => {
                  uploadOnPressHandler();
                }
          }
        />
        <TouchableOpacity
          style={styles?.skipContainer}
          onPress={
            route.params?.isEdit
              ? () => {
                  navigation?.navigate("Roles");
                }
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
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Error!"}
          errorDescription={error}
          clearError={() => {
            setError("");
          }}
        />
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
