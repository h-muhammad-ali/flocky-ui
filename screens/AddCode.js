import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Button from "../components/Button";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";

const AddCode = ({ navigation, route }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid?.SHORT);
  };
  const onSubmit = (data) => {
    console.log("data", data);
    reset();
    route?.params?.resetCode
      ? navigation?.navigate("Reset Password", {
          code: data?.code,
          email: route.params?.email,
        })
      : navigation?.navigate("AdminSignUp", {
          code: data?.code,
        });
  };

  const resendHandler = () => {
    const data = {
      email: route.params?.email,
    };
    setLoading(true);
    axios
      .post(`${BASE_URL}/auth/password/reset/token`, data, {
        timeout: 5000,
      })
      .then((response) => {
        reset();
        showToast("Email Sent!");
      })
      .catch((error) => {
        if (error?.response) {
          setError(
            `${error?.response?.data}. Status Code: ${error?.response?.status}`
          );
        } else if (error?.request) {
          setError("Network Error! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles?.container}>
        <Header
          text="Add Verification Code"
          navigation={() => navigation?.goBack()}
        />
        <View style={styles?.subContainer}>
          <Text style={styles?.text}>
            Enter the code from the email we just sent you
          </Text>
          <Controller
            name="code"
            control={control}
            rules={{
              required: { value: true, message: "Enter the code first!" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                selectionColor={"#5188E3"}
                style={[styles?.input, errors?.code && styles?.errorBorder]}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors?.code && (
            <Text style={styles?.error}>{errors?.code?.message}</Text>
          )}
        </View>
        <View style={styles?.resendContainer}>
          <Text style={styles?.linkLabel}>Haven't received it? </Text>
          <TouchableOpacity
            onPress={() => {
              resendHandler();
            }}
          >
            <Text style={styles?.link}>Resend!</Text>
          </TouchableOpacity>
        </View>
        <Button text="Verify" onPress={handleSubmit(onSubmit)} />
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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  input: {
    borderBottomColor: "#B7B7B7",
    borderBottomWidth: 2,
    fontSize: 20,
    height: 45,
    marginHorizontal: 50,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: 200,
    textAlign: "center",
    textAlignVertical: "center",
  },
  resendContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 20,
  },
  text: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 20,
    textAlign: "center",
  },
  link: {
    fontFamily: "Kanit-Medium",
    fontSize: 15,
    textAlign: "center",
    color: "#5188E3",
  },
  linkLabel: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 15,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginStart: 10,
    marginBottom: 1,
  },
  errorBorder: {
    borderBottomColor: "red",
  },
});
