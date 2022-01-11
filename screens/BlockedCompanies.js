import React from "react";
import { View, FlatList } from "react-native";
import CompanyCard from "../components/CompanyCard";

const BlockedCompanies = () => {
  const dummyCompanies = [
    {
      id: 1,
      name: "Microsoft",
      adminName: "Ali",
      adminEmail: "microsoft@gmail.com",
    },
    {
      id: 2,
      name: "Google",
      adminName: "Suleman",
      adminEmail: "google@gmail.com",
    },
    {
      id: 3,
      name: "Meta",
      adminName: "Ahsan",
      adminEmail: "meta@gmail.com",
    },
  ];
  return (
    <View>
      <FlatList
        data={dummyCompanies}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <CompanyCard
            companyName={item?.name}
            adminName={item?.adminName}
            adminEmail={item?.adminEmail}
            forUnblock={true}
            onPress={() => {}}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BlockedCompanies;
