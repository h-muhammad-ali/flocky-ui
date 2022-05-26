import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons, FontAwesome, EvilIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { clearCurrentUserJWT } from "../redux/currentUser/currentUserActions";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";

const CustomDrawer = ({ isAdmin, ...props }) => {
  const dispatch = useDispatch();
  const { jwt } = useSelector((state) => state?.currentUser);
  const [organizationName, setOrganizationName] = useState("");
  const [peopleCount, setPeopleCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchAdminInfo = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/admin/dashboard`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        const resp = response?.data;
        setOrganizationName(resp?.organization_name);
        setPeopleCount(resp?.people_count);
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
  useEffect(() => {
    if (isAdmin) {
      fetchAdminInfo();
    }
  }, []);
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        {loading ? (
          <>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" color="#5188E3" />
            </View>
          </>
        ) : (
          <>
            {!isAdmin ? (
              <View style={styles.headerContainer}>
                <Ionicons name="person-circle" size={100} />
                <Text style={[styles?.headerText, { fontSize: 30 }]}>
                  John Doe
                </Text>
              </View>
            ) : (
              <View>
                <View style={styles.headerContainer}>
                  <FontAwesome name="institution" size={100} color="black" />
                  {organizationName ? (
                    <Text style={[styles?.headerText, { fontSize: 30 }]}>
                      {organizationName}
                    </Text>
                  ) : (
                    <></>
                  )}
                  {peopleCount ? (
                    <Text style={styles?.headerText}>
                      People Count: {peopleCount}
                    </Text>
                  ) : (
                    <></>
                  )}
                  <TouchableOpacity
                    style={styles?.button}
                    onPress={() => {
                      fetchAdminInfo();
                    }}
                  >
                    <Text style={styles?.buttonText}>Refresh</Text>
                    <EvilIcons name="refresh" size={24} color="#427646" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        style={styles.logout}
        labelStyle={styles.logoutText}
        label="Logout"
        onPress={() => {
          dispatch(clearCurrentUserJWT());
        }}
        icon={({ focused, color, size }) => (
          <Ionicons color={color} size={size} name="exit" />
        )}
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

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#5188E3",
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    marginHorizontal: 10,
  },
  logout: {
    backgroundColor: "#C54E57",
  },
  logoutText: {
    color: "white",
  },
  button: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 5,
    paddingVertical: 5,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: "#427646",
    borderWidth: 1,
  },
  buttonText: {
    color: "#427646",
    fontFamily: "NunitoSans-Regular",
    fontSize: 10,
    textAlignVertical: "center",
  },
});
