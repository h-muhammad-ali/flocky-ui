import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import RankCard from "../components/RankCard";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;

let apiCancelToken;
const WallOfHonor = ({ navigation }) => {
  const { jwt } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topUsers, setTopUsers] = useState([]);
  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    setLoading(true);
    axios
      .get(`${BASE_URL}/wall-of-honor`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cancelToken: apiCancelToken?.token,
      })
      .then((response) => {
        const resp = response?.data;
        resp === null || resp?.length < 3
          ? setError("Not Enough Patrons to display!")
          : setTopUsers(resp);
      })
      .catch((error) => {
        console?.log(error);
        if (error?.response) {
          setError(`${error?.response?.data}.`);
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else if (axios.isCancel(error)) {
          console.log(error?.message);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, []);

  const dummyTopThree = [
    {
      id: 1,
      name: "John Doe",
      rides: 100,
    },
    {
      id: 2,
      name: "John Doe",
      rides: 60,
    },
    {
      id: 3,
      name: "John Doe",
      rides: 30,
    },
  ];
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <View style={styles?.container}>
      <Header
        text="Wall of Honor"
        navigation={() => navigation?.goBack()}
        isBackButtonVisible={true}
      />
      {topUsers?.length === 0 ? (
        <>
          <View style={styles?.positionContainer}>
            <View style={styles?.position}>
              <Ionicons
                name="person-circle"
                size={SCREEN_WIDTH / 3}
                color={"white"}
              />
              <Text style={styles.name}>{dummyTopThree[1].name}</Text>
              <View style={styles.ridesContainer}>
                <Ionicons name="disc" size={25} />
                <Text style={styles.rides}>{dummyTopThree[1].rides}</Text>
              </View>
            </View>
            <View style={styles?.position}>
              <Ionicons
                name="person-circle"
                size={SCREEN_WIDTH / 2.5}
                color={"white"}
              />
              <Text style={styles.name}>{dummyTopThree[0].name}</Text>
              <View style={styles.ridesContainer}>
                <Ionicons name="disc" size={25} />
                <Text style={styles.rides}>{dummyTopThree[0].rides}</Text>
              </View>
            </View>
            <View style={styles?.position}>
              <Ionicons
                name="person-circle"
                size={SCREEN_WIDTH / 3.5}
                color={"white"}
              />
              <Text style={styles.name}>{dummyTopThree[2].name}</Text>
              <View style={styles.ridesContainer}>
                <Ionicons name="disc" size={25} />
                <Text style={styles.rides}>{dummyTopThree[2].rides}</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles?.positionContainer}>
            <View style={styles?.position}>
              {topUsers[1]?.img_url ? (
                <Image
                  source={{ uri: topUsers[1]?.img_url }}
                  style={styles?.imagePos2}
                />
              ) : (
                <Ionicons
                  name="person-circle"
                  size={SCREEN_WIDTH / 3.5}
                  color={"white"}
                />
              )}
              <Text style={styles.name} numberOfLines={3}>
                {topUsers[1]?.name}
              </Text>
              <View style={styles.ridesContainer}>
                <Ionicons name="disc" size={25} />
                <Text style={styles.rides}>{topUsers[1]?.ride_count}</Text>
              </View>
            </View>
            <View style={styles?.position}>
              {topUsers[0]?.img_url ? (
                <Image
                  source={{ uri: topUsers[0]?.img_url }}
                  style={styles?.imagePos1}
                />
              ) : (
                <Ionicons
                  name="person-circle"
                  size={SCREEN_WIDTH / 3}
                  color={"white"}
                />
              )}
              <Text style={styles.name} numberOfLines={3}>
                {topUsers[0]?.name}
              </Text>
              <View style={styles.ridesContainer}>
                <Ionicons name="disc" size={25} />
                <Text style={styles.rides}>{topUsers[0]?.ride_count}</Text>
              </View>
            </View>
            <View style={styles?.position}>
              {topUsers[2]?.img_url ? (
                <Image
                  source={{ uri: topUsers[2]?.img_url }}
                  style={styles?.imagePos3}
                />
              ) : (
                <Ionicons
                  name="person-circle"
                  size={SCREEN_WIDTH / 4}
                  color={"white"}
                />
              )}
              <Text style={styles.name} numberOfLines={3}>
                {topUsers[2]?.name}
              </Text>
              <View style={styles.ridesContainer}>
                <Ionicons name="disc" size={25} />
                <Text style={styles.rides}>{topUsers[2]?.ride_count}</Text>
              </View>
            </View>
          </View>
          <FlatList
            data={topUsers.slice(3, 11)}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <RankCard
                name={item?.name}
                ridesCount={item?.ride_count}
                imgURL={item?.img_url}
              />
            )}
          />
        </>
      )}
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Error"}
          errorDescription={error}
          clearError={() => {
            setError("");
            navigation?.goBack();
          }}
        />
      </View>
    </View>
  );
};

export default WallOfHonor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  positionContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: "#5188E3",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 30,
  },
  position: {
    justifyContent: "center",
    alignItems: "center",
  },
  ridesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  name: {
    fontFamily: "Kanit-Regular",
    fontSize: 20,
    color: "white",
    width: SCREEN_WIDTH / 3.3,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 3,
  },
  rides: {
    fontFamily: "Kanit-Light",
  },
  imagePos1: {
    width: SCREEN_WIDTH / 3 - 15,
    height: SCREEN_WIDTH / 3 - 15,
    borderRadius: (SCREEN_WIDTH / 3 - 10) / 2,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  imagePos2: {
    width: SCREEN_WIDTH / 3.5 - 15,
    height: SCREEN_WIDTH / 3.5 - 15,
    borderRadius: (SCREEN_WIDTH / 3.5 - 10) / 2,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  imagePos3: {
    width: SCREEN_WIDTH / 4 - 15,
    height: SCREEN_WIDTH / 4 - 15,
    borderRadius: (SCREEN_WIDTH / 4 - 10) / 2,
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
