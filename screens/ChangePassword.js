import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

const ChangePassword = ({ navigation }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { jwt } = useSelector((state) => state?.currentUser);
  let decoded;
  decoded = jwt_decode(jwt);

  const onSubmit = (data) => {
    const userData = {
      email: decoded?.email,
      password: data?.password,
    };
    setLoading(true);
    axios
      .post(`${BASE_URL}/auth/signin`, userData, {
        timeout: 5000,
      })
      .then((response) => {
        reset();
        navigation?.navigate("Reset Password", {
          mode: "change",
        });
      })
      .catch((error) => {
        if (error?.response) {
          if (error?.response?.status === 404) {
            setError("Incorrect Password!");
          } else {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          }
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
    <View style={styles.container}>
      <Header
        text="Change Password"
        navigation={() => navigation?.goBack()}
        isBackButtonVisible={true}
      />
      <Text style={styles?.label}>Enter Current Password</Text>
      {errors?.password && (
        <Text style={styles?.error}>{errors?.password?.message}</Text>
      )}
      <Controller
        name="password"
        control={control}
        rules={{
          required: { value: true, message: "This field is required" },
          minLength: {
            value: 8,
            message: "Password must be >= 8 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles?.input, errors?.password && styles?.errorBorder]}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      <Button text="Continue" onPress={handleSubmit(onSubmit)} />
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

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 45,
    marginHorizontal: 10,
    paddingStart: 10,
    marginBottom: 15,
  },
  error: {
    color: "red",
    fontSize: 10,
    marginStart: 10,
    marginBottom: 1,
  },
  errorBorder: {
    borderColor: "red",
  },
  label: {
    marginBottom: 5,
    marginStart: 10,
  },
});
