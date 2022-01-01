import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import AdminUserCard from "../components/AdminUserCard";

const AdminBlockedUsers = () => {
  const dummyUsers = [
    {
      id: 4,
      name: "John Doe",
      email: "john@gmail.com",
    },
    {
      id: 5,
      name: "John Doe",
      email: "doe@gmail.com",
    },
  ];
  return (
    <FlatList
      data={dummyUsers}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => (
        <TouchableOpacity>
          <AdminUserCard
            name={item?.name}
            email={item?.email}
            isBlocked={true}
          />
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default AdminBlockedUsers;
