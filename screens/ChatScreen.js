import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { View, KeyboardAvoidingView, Text, Image } from "react-native";
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
import ErrorDialog from "../components/ErrorDialog";
import ProfilePicture from "../components/ProfilePicture";
import { Ionicons } from "@expo/vector-icons";

LogBox.ignoreLogs(["Setting a timer"]);

const ChatScreen = ({ navigation, route }) => {
  const { rideID, role } = useSelector((state) => state?.ride);
  const { imageURL } = useSelector((state) => state?.currentUser);
  const { connectionStatus } = useSelector((state) => state?.internetStatus);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    setMessages([]);
  }, []);
  useLayoutEffect(() => {
    navigation?.setOptions({
      headerShown: true,
      headerBackTitleVisible: false,
      headerTintColor: "white",
      headerTransparent: true,
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
            {route.params?.name}
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const sentTo = role === "P" ? route.params?.id : rideID;
    const sentBy = role === "P" ? rideID : route.params?.id;
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

  const onSend = useCallback(
    async (messages = []) => {
      if (connectionStatus) {
        const sentTo = role === "P" ? route.params?.id : rideID;
        const sentBy = role === "P" ? rideID : route.params?.id;
        const msg = messages[0];
        const msgObj = {
          ...msg,
          sentBy: sentBy,
          sentTo: sentTo,
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
      } else {
        setError("Can't send Message! No Internet Connection.");
      }
    },
    [connectionStatus]
  );

  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: role === "P" ? rideID : route.params?.id,
          avatar: imageURL
            ? imageURL
            : "https://firebasestorage.googleapis.com/v0/b/flocky-2716.appspot.com/o/user_unknown.png?alt=media&token=65beea94-11e7-407b-ae25-fd33e4f0c7b3",
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
        renderAvatar={(props) =>
          !props?.currentMessage?.user?.avatar?.includes("user_unknown") ? (
            <ProfilePicture
              imageURL={props?.currentMessage?.user?.avatar}
              size={36}
              removeMargins={true}
            />
          ) : (
            <Image
              source={require("../assets/flocky-assets/user_unknown.png")}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          )
        }
      />
      <View>
        <ErrorDialog
          visible={!!error}
          errorHeader={"Error!"}
          errorDescription={error}
          clearError={() => {
            setError("");
          }}
        />
      </View>
      <KeyboardAvoidingView behavior={"position"} />
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
