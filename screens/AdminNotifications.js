import React from "react";
import { FlatList, View } from "react-native";
import AdminNotificationCard from "../components/AdminNotificationCard";

const AdminNotifications = () => {
  const dummyNotifications = [
    {
      id: 1,
      description: "Ahsan has recently joined Flocky.",
      userID: 1,
    },
    {
      id: 2,
      description: "Suleman just hopped in!",
      userID: 2,
    },
    {
      id: 3,
      description: "Ali has recently joined Flocky.",
      userID: 3,
    },
  ];
  return (
    <View>
      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <AdminNotificationCard
            text={item?.description}
            userID={item?.userID}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AdminNotifications;
