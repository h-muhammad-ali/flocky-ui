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

let apiCancelToken;
const AdminBlockedUsers = () => {
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [serverError, setServerError] = useState(false);
  const fetchBlockedUsers = (isLoading) => {
    if (connectionStatus) {
      if (isLoading) setLoading(true);
      else setFetching(true);
      axios
        .get(`${BASE_URL}/admin/users/blocked`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cancelToken: apiCancelToken?.token,
        })
        .then((response) => {
          if (serverError) setServerError(false);
          const resp = response?.data;
          setBlockedUsers(resp);
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          } else if (error?.request) {
            if (connectionStatus) setServerError(true);
          } else if (axios.isCancel(error)) {
            console.log(error?.message);
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
    apiCancelToken = axios.CancelToken.source();
    fetchBlockedUsers(true);
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
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
        data={blockedUsers}
        keyExtractor={(item) => item?.user_id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <AdminUserCard
              userId={item?.user_id}
              name={item?.name}
              email={item?.email}
              imgURL={item?.imgURL}
              isBlocked={true}
              setUpdated={setUpdated}
              updated={updated}
            />
          </TouchableOpacity>
        )}
        onRefresh={() => {
          fetchBlockedUsers(false);
        }}
        showsVerticalScrollIndicator={false}
        refreshing={fetching}
        ListEmptyComponent={
          <EmptyFlatlistMessage
            networkError={!connectionStatus}
            serverError={serverError}
            serverErrorHandler={() => {
              fetchBlockedUsers(true);
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

export default AdminBlockedUsers;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
});
