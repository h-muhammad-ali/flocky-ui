import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { View, KeyboardAvoidingView, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { firestore } from "../config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);

const ChatScreen = ({ navigation, route }) => {
  const { id } = useSelector((state) => state?.currentUser);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages([]);
  }, []);
  useLayoutEffect(() => {
    navigation?.setOptions({
      headerShown: true,
      headerBackTitleVisible: false,
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#5188E3",
      },
      headerTitle: () => (
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "700",
            }}
          >
            Muhammad
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const sentTo = id === 1 ? 2 : 1;
    const sentBy = sentTo === 1 ? 2 : 1;
    const docId =
      sentTo > sentBy ? sentBy + "-" + sentTo : sentTo + "-" + sentBy;
    const messagesRef = collection(firestore, "chats", docId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot?.docs?.map((doc) => ({
        ...doc?.data(),
        createdAt: doc?.data()?.createdAt?.toDate(),
      }));
      setMessages(allMessages);
    });
    return unsubscribe;
  }, [route]);

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const msgObj = {
      ...msg,
      sentBy: id,
      sentTo: id === 1 ? 2 : 1,
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, msgObj)
    );
    const docId =
      msgObj?.sentTo > msgObj?.sentBy
        ? msgObj?.sentBy + "-" + msgObj?.sentTo
        : msgObj?.sentTo + "-" + msgObj?.sentBy;
    const messagesRef = collection(firestore, "chats", docId, "messages");
    await addDoc(messagesRef, { ...msgObj, createdAt: serverTimestamp() });
  }, []);

  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: id,
          avatar: "https://placeimg.com/140/140/any",
        }}
        showUserAvatar
        multiline={false}
        textInputProps={{
          selectionColor: "#5188E3",
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{
              left: {
                color: "white",
              },
              right: {
                color: "white",
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: "#C4C4C4",
              },
              right: {
                backgroundColor: "#5188E3",
              },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "#DADFDF",
              borderRadius: 20,
              marginHorizontal: 10,
            }}
          />
        )}
      />
      <KeyboardAvoidingView behavior={"position"} keyboardVerticalOffset={3} />
    </View>
  );
};
//     // <View style={styles?.container}>
//     //  <Header
//     //     text={route.params?.name}
//     //     navigation={() => navigation?.goBack()}
//     //   />
//     //   <FlatList
//     //     data={messages}
//     //     ListFooterComponent={
//     //       <Text style={styles.flatlistHeader}>
//     //         {moment()?.format("MMMM DD, YYYY")}
//     //       </Text>
//     //     }
//     //     keyExtractor={(item, index) => index}
//     //     renderItem={({ item }) => (
//     //       <>
//     //         {item?.type === "sent" ? (
//     //           <SentMessage text={item?.text} time={item?.time} />
//     //         ) : (
//     //           <ReceivedMessage text={item?.text} time={item?.time} />
//     //         )}
//     //       </>
//     //     )}
//     //     inverted
//     //   />
//     //   <View style={styles?.textBarContainer}>
//     //     <TextInput
//     //       value={text}
//     //       style={styles?.textBar}
//     //       placeholderTextColor={"#7F8483"}
//     //       placeholder="Send a message..."
//     //       selectionColor={"#5188E3"}
//     //       multiline
//     //       onChangeText={(text) => setText(text)}
//     //     />
//     //     <TouchableOpacity
//     //       onPress={() => {
//     //         setMessages((prevState) => [
//     //           { type: "sent", text: text, time: moment()?.format("h:mm a") },
//     //           ...prevState,
//     //         ]);
//     //         setText("");
//     //       }}
//     //     >
//     //       <Ionicons name="send-sharp" color={"#5188E3"} size={35} />
//     //     </TouchableOpacity>
//     //   </View>
//     // </View>
//   );
// };

export default ChatScreen;
