import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";

const AdminUserCard = ({
  userId,
  name,
  email,
  imgURL,
  isBlocked,
  setUpdated,
  updated,
}) => {
  const { jwt } = useSelector((state) => state?.currentUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const changeStatus = () => {
    setLoading(true);
    axios
      .put(`${BASE_URL}/admin/users/${userId}/changestatus`, null, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        setUpdated(!updated);
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
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <View style={styles?.container}>
      {imgURL ? (
        <Image source={{ uri: imgURL }} style={styles?.image} />
      ) : (
        <Ionicons name="person-circle" size={70} />
      )}
      <View style={styles?.subContainer}>
        <View>
          <Text style={styles?.name}>{name}</Text>
          <Text style={styles?.email}>{email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            changeStatus();
          }}
        >
          <Ionicons
            name={isBlocked ? "add-circle-outline" : "remove-circle-outline"}
            color="#5188E3"
            size={30}
          />
        </TouchableOpacity>
      </View>
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

export default AdminUserCard;

const styles = StyleSheet?.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 5,
    borderBottomWidth: 1,
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 20,
  },
  email: {
    fontFamily: "NunitoSans-SemiBold",
    fontSize: 16,
    color: "#999595",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 35,
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
