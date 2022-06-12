import React, { useState, useEffect } from "react";
import { FlatList, View, ActivityIndicator, StyleSheet } from "react-native";
import AdminNotificationCard from "../components/AdminNotificationCard";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";
import EmptyFlatlistMessage from "../components/EmptyFlatlistMessage";

let apiCancelToken;
const AdminNotifications = () => {
  const joiningSentences = [
    "just hopped in!",
    "has joined flocky.",
    "is here!",
    "just showed up!",
    "joined the party!",
  ];
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [notifications, setNotifications] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const fetchNotifications = (isLoading) => {
    if (connectionStatus) {
      if (isLoading) setLoading(true);
      else setFetching(true);
      axios
        .get(`${BASE_URL}/admin/dashboard`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cancelToken: apiCancelToken?.token,
        })
        .then((response) => {
          if (serverError) setServerError(false);
          const resp = response?.data;
          setNotifications(resp?.recently_joined_persons);
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            if (error?.response?.status !== 404) {
              setError(
                `${error?.response?.data}. Status Code: ${error?.response?.status}`
              );
            } else {
              setNotifications([]);
            }
            setServerError(false);
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
    fetchNotifications(true);
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, [connectionStatus]);
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
        data={notifications}
        keyExtractor={() => {
          return (
            new Date().getTime().toString() +
            Math.floor(
              Math.random() * Math.floor(new Date().getTime())
            ).toString()
          );
        }}
        renderItem={({ item }) => (
          <AdminNotificationCard
            text={`${item} ${
              joiningSentences[
                Math.floor(Math.random() * joiningSentences?.length)
              ]
            }`}
          />
        )}
        onRefresh={() => {
          fetchNotifications(false);
        }}
        showsVerticalScrollIndicator={false}
        refreshing={fetching}
        ListEmptyComponent={
          <EmptyFlatlistMessage
            networkError={!connectionStatus}
            serverError={serverError}
            serverErrorHandler={() => {
              fetchNotifications(true);
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

export default AdminNotifications;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
});
