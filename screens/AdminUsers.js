import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import AdminUserCard from "../components/AdminUserCard";

const AdminUsers = () => {
  const dummyUsers = [
    {
      id: 1,
      name: "Suleman Sohail",
      email: "bcsf18m002@pucit.edu.pk",
    },
    {
      id: 2,
      name: "Muhammad Ahsan",
      email: "bcsf18m007@pucit.edu.pk",
    },
    {
      id: 3,
      name: "Muhammad Ali",
      email: "bcsf18m016@pucit.edu.pk",
    },
  ];
  return (
    <FlatList
      data={dummyUsers}
      keyExtractor={(item) => item?.id}
      renderItem={({ item }) => (
        <TouchableOpacity>
          <AdminUserCard name={item?.name} id={item?.id} email={item?.email} />
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default AdminUsers;
