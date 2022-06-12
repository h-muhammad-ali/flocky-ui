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

const CompanyCard = ({
  companyId,
  companyName,
  adminName,
  adminEmail,
  forApprove,
  forBlock,
  forUnblock,
  setUpdated,
  updated,
}) => {
  const { jwt } = useSelector((state) => state?.currentUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const changeStatus = () => {
    setLoading(true);
    console?.log(companyId);
    axios
      .put(
        `${BASE_URL}/flocky/admin/organizations/${companyId}/change-status`,
        null,
        {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
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

  const approveOrganization = () => {
    setLoading(true);
    console?.log(companyId);
    axios
      .put(
        `${BASE_URL}/flocky/admin/organizations/${companyId}/approve`,
        null,
        {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
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
      <Text style={styles?.companyName}>{companyName}</Text>
      <View style={styles?.field}>
        <Text style={styles?.label}>Admin Name:</Text>
        <Text style={styles?.value}>{adminName}</Text>
      </View>
      <View style={styles?.field}>
        <Text style={styles?.label}>Admin Email:</Text>
        <Text style={styles?.value}>{adminEmail}</Text>
      </View>
      {forApprove ? (
        <TouchableOpacity
          style={[styles?.button, { backgroundColor: "#427646" }]}
          onPress={() => {
            approveOrganization();
          }}
        >
          <Text style={styles?.buttonText}>Approve</Text>
        </TouchableOpacity>
      ) : forBlock ? (
        <TouchableOpacity
          style={[styles?.button, { backgroundColor: "#C54E57" }]}
          onPress={() => {
            changeStatus();
          }}
        >
          <Text style={styles?.buttonText}>Block</Text>
        </TouchableOpacity>
      ) : forUnblock ? (
        <TouchableOpacity
          style={[styles?.button, { backgroundColor: "#5188E3" }]}
          onPress={() => {
            changeStatus();
          }}
        >
          <Text style={styles?.buttonText}>Unblock</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
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

export default CompanyCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  companyName: {
    fontFamily: "Kanit-Medium",
    color: "#5188E3",
    fontSize: 18,
  },
  field: {
    flexDirection: "row",
  },
  label: {
    fontFamily: "NunitoSans-Regular",
  },
  value: {
    fontFamily: "Kanit-Regular",
    color: "#5188E3",
    paddingStart: 5,
    fontSize: 15,
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    paddingVertical: 8,
    textAlign: "center",
  },
});
