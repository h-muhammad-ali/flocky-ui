import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AdminUserCard from "../components/AdminUserCard";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";
import EmptyFlatlistMessage from "../components/EmptyFlatlistMessage";

const AdminUsers = () => {
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [serverError, setServerError] = useState(false);
  const fetchUsers = (isLoading) => {
    if (connectionStatus) {
      if (isLoading) setLoading(true);
      else setFetching(true);
      axios
        .get(`${BASE_URL}/admin/users/unblocked`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          if (serverError) setServerError(false);
          const resp = response?.data;
          setUsers(resp);
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          } else if (error?.request) {
            if (connectionStatus) setServerError(true);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          if (isLoading) setLoading(false);
          else setFetching(false);
        });
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, [updated, connectionStatus]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <View style={styles?.container}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={users}
        keyExtractor={(item) => item?.user_id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <AdminUserCard
              userId={item?.user_id}
              name={item?.name}
              email={item?.email}
              imgURL={item?.imgURL}
              isBlocked={false}
              setUpdated={setUpdated}
              updated={updated}
            />
          </TouchableOpacity>
        )}
        onRefresh={() => {
          fetchUsers(false);
        }}
        showsVerticalScrollIndicator={false}
        refreshing={fetching}
        ListEmptyComponent={
          <EmptyFlatlistMessage
            networkError={!connectionStatus}
            serverError={serverError}
            serverErrorHandler={() => {
              fetchUsers(true);
            }}
          />
        }
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

export default AdminUsers;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
});
