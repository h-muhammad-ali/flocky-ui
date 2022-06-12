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
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";
import { storage } from "../config/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { setCurrentUserJWT } from "../redux/currentUser/currentUserActions";
import ConfirmationDialog from "../components/ConfirmationDialog";

const AddPhoto = ({ navigation, route }) => {
  const [image, setImage] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [goBackConfirmation, setGoBackConfirmation] = useState(false);
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { jwt } = useSelector((state) => state?.currentUser);
  const dispatch = useDispatch();
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid?.LONG);
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
    setUploading(true);
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
    const storageRef = ref(storage, `userProfileImages/${Date?.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        blob.close();
        setUploading(false);
        switch (error.code) {
          case "storage/unauthorized":
            setError(
              "You don't have permission to access the object. firebaseError"
            );
            break;
          case "storage/unknown":
            setError(`Unknown error occurred. ${error?.serverResponse}`);
            break;
          default:
            setError(`Unknown error occurred. ${error?.serverResponse}`);
        }
      },
      () => {
        blob.close();
        setUploading(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImgURL(downloadURL);
        });
      }
    );
  }

  const removePhoto = () => {
    setUploading(true);
    axios
      .delete(`${BASE_URL}/account/user/profile-picture/delete`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then(() => {
        let imagePath = String(route.params?.imageURL);
        let name = imagePath.substring(
          imagePath.indexOf("%2F") + 3,
          imagePath.indexOf("?")
        );

        const deleteRef = ref(storage, `userProfileImages/${name}`);
        deleteObject(deleteRef)
          .then(() => {
            console?.log("Successful!");
            showToast("Photo updated successfully!");
            navigation?.navigate("Roles");
          })
          .catch((error) => {
            console?.log(error);
            setError(error);
          });
      })
      .catch((error) => {
        console?.log(error);
        if (error?.response) {
          setError(
            `${error?.response?.data}. Status Code: ${error?.response?.status}`
          );
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  useEffect(() => {
    if (imgURL) {
      const updatedData = { profile_picture: imgURL };
      axios
        .put(`${BASE_URL}/account/user/profile-picture/update`, updatedData, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${
              route.params?.isEdit ? jwt : route.params?.jwt
            }`,
          },
        })
        .then(() => {
          if (route.params?.isEdit) {
            showToast("Photo updated successfully!");
            navigation?.navigate("Roles");
          } else if (route.params?.isAdmin) {
            showToast("Photo uploaded successfully!");
            navigation.reset({
              index: 1,
              routes: [
                { name: "MainMenu" },
                {
                  name: "VerificationFinished",
                },
              ],
            });
          } else {
            showToast("Photo uploaded successfully!");
            dispatch(setCurrentUserJWT(route.params?.jwt));
          }
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          } else if (error?.request) {
            setError("Server not reachable! Please try again later.");
          } else {
            console.log(error);
          }
        })
        .finally(() => {});
    }
  }, [imgURL]);

  useEffect(() => {
    if (route.params?.isEdit) setImage(route.params?.imageURL);
  }, []);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (imgURL) {
          //  if (!route.params?.isAdmin || imgURL) {
          return;
        }
        e.preventDefault();
        setAction(e.data.action);
        setGoBackConfirmation(true);
      }),
    [navigation, imgURL]
  );

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
            {uploading ? (
              <ActivityIndicator size="large" color="#5188E3" />
            ) : (
              <Image source={{ uri: image }} style={styles?.image} />
            )}
          </View>
        ) : (
          <Ionicons name="person-circle" size={200} />
        )}
        <TouchableOpacity
          disabled={uploading}
          style={styles?.addPhotoContainer}
          onPress={pickImage}
        >
          <Text style={styles?.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!image || uploading}
          style={styles?.skipContainer}
          onPress={() => {
            setImage("");
          }}
        >
          <Text style={styles?.skipText}>Remove Photo</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Button
          isDisabled={uploading || (!image && !route?.params.isEdit)}
          text={route.params?.isEdit ? "Update Photo" : "Continue"}
          onPress={
            route.params?.isEdit
              ? () => {
                  if (route.params?.imageURL !== image) {
                    if (route.params?.imageURL && !image) {
                      removePhoto();
                    } else uploadImageAsync(image);
                  } else {
                    navigation?.navigate("Roles");
                  }
                }
              : route.params?.isAdmin
              ? () => {
                  if (image) {
                    uploadImageAsync(image);
                  } else {
                    navigation.reset({
                      index: 1,
                      routes: [
                        { name: "MainMenu" },
                        {
                          name: "VerificationFinished",
                        },
                      ],
                    });
                  }
                }
              : () => {
                  if (image) {
                    uploadImageAsync(image);
                  } else {
                    dispatch(setCurrentUserJWT(route.params?.jwt));
                  }
                }
          }
        />
        <TouchableOpacity
          disabled={uploading}
          style={styles?.skipContainer}
          onPress={
            route.params?.isEdit
              ? () => {
                  navigation?.navigate("Roles");
                }
              : route.params?.isAdmin
              ? () => {
                  navigation.reset({
                    index: 1,
                    routes: [
                      { name: "MainMenu" },
                      {
                        name: "VerificationFinished",
                      },
                    ],
                  });
                }
              : () => {
                  dispatch(setCurrentUserJWT(route.params?.jwt));
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
        <ConfirmationDialog
          visible={goBackConfirmation}
          heading={"Wait!"}
          body={"Are you sure you don't want to upload your profile photo?"}
          positiveHandler={() => {
            navigation?.dispatch(action);
          }}
          negativeHandler={() => {
            setGoBackConfirmation(false);
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
