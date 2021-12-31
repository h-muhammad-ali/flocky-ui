import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Header from "../components/Header";
import SentMessage from "../components/SentMessage";
import moment from "moment";
import ReceivedMessage from "../components/ReceivedMessage";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = ({ name }) => {
  const dummyTextMessages = [
    {
      type: "sent",
      text: "Hey!",
      time: "11:00 pm",
    },
    {
      type: "received",
      text: "Hey!",
      time: "11:00 pm",
    },
    {
      type: "sent",
      text: "How are you..?",
      time: "11:00 pm",
    },
    {
      type: "received",
      text: "I'm good, hru..?",
      time: "11:00 pm",
    },
  ];
  const [messages, setMessages] = useState(dummyTextMessages);
  const [text, setText] = useState("");
  return (
    <View style={styles?.container}>
      <Header text={name} />
      <FlatList
        data={messages}
        ListFooterComponent={
          <Text style={styles.flatlistHeader}>{moment()?.format("MMMM DD, YYYY")}</Text>
        }
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <>
            {item?.type === "sent" ? (
              <SentMessage text={item?.text} time={item?.time} />
            ) : (
              <ReceivedMessage text={item?.text} time={item?.time} />
            )}
          </>
        )}
        inverted
      />
      <View style={styles?.textBarContainer}>
        <TextInput
          value={text}
          style={styles?.textBar}
          placeholderTextColor={"#7F8483"}
          placeholder="Send a message..."
          selectionColor={"#5188E3"}
          multiline
          onChangeText={(text) => setText(text)}
        />
        <TouchableOpacity
          onPress={() => {
            setMessages((prevState) => [
              { type: "sent", text: text, time: moment()?.format("h:mm a") },
              ...prevState,
            ]);
            setText("");
          }}
        >
          <Ionicons name="send-sharp" color={"#5188E3"} size={35} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
  },
  textBar: {
    backgroundColor: "#DADFDF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 50,
    flex: 1,
  },
  textBarContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 10,
  },
  flatlistHeader: {
    textAlign: "center",
    color: "grey",
    marginBottom: 10,
  },
});
