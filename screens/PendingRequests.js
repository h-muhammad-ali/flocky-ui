import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import CompanyCard from "../components/CompanyCard";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";
import EmptyFlatlistMessage from "../components/EmptyFlatlistMessage";

let apiCancelToken;
const PendingRequests = () => {
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [approved, setApproved] = useState(false);
  const [serverError, setServerError] = useState(false);
  const fetchOrganizations = (isLoading) => {
    if (connectionStatus) {
      if (isLoading) setLoading(true);
      else setFetching(true);
      axios
        .get(`${BASE_URL}/flocky/admin/organizations/approval`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          cancelToken: apiCancelToken.token,
        })
        .then((response) => {
          if (serverError) setServerError(false);
          const resp = response?.data;
          setOrganizations(resp);
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            if (error?.response?.status !== 404) {
              setError(
                `${error?.response?.data}. Status Code: ${error?.response?.status}`
              );
            } else {
              setOrganizations([]);
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
    fetchOrganizations(true);
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, [approved, connectionStatus]);

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
        data={organizations}
        keyExtractor={(item) => item?.organization_id}
        renderItem={({ item }) => (
          <CompanyCard
            companyId={item?.organization_id}
            companyName={item?.organization_name}
            adminName={item?.admin_name}
            adminEmail={item?.admin_email}
            forApprove={true}
            setUpdated={setApproved}
            updated={approved}
          />
        )}
        onRefresh={() => {
          fetchOrganizations(false);
        }}
        showsVerticalScrollIndicator={false}
        refreshing={fetching}
        ListEmptyComponent={
          <EmptyFlatlistMessage
            networkError={!connectionStatus}
            serverError={serverError}
            serverErrorHandler={() => {
              fetchOrganizations(true);
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

export default PendingRequests;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
});
