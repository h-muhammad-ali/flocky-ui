import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector, useDispatch } from "react-redux";

const ResetPassword = ({ navigation, route }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid?.SHORT);
  };
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { jwt } = useSelector((state) => state?.currentUser);
  const onSubmit = (data) => {
    if (route.params?.mode === "change") {
      setLoading(true);
      axios
        .put(
          `${BASE_URL}/auth/password/change`,
          { password: data?.password },
          {
            timeout: 5000,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          showToast(response?.data);
          reset();
          navigation.navigate("Roles");
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          } else if (error?.request) {
            setError("Server not reachable! Please try again later.");
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const newData = {
        email: route.params?.email,
        new_password: data?.password,
        token: route.params?.code,
      };
      setLoading(true);
      axios
        .put(`${BASE_URL}/auth/password/reset`, newData, {
          timeout: 5000,
        })
        .then((response) => {
          console.log(response);
          showToast(response?.data);
          reset();
          navigation.navigate("LogIn");
        })
        .catch((error) => {
          console?.log(error);
          if (error?.response) {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          } else if (error?.request) {
            setError("Server not reachable! Please try again later.");
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
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
        text="New Password"
        navigation={() => navigation?.goBack()}
        isBackButtonVisible={true}
      />
      <Text style={styles?.label}>New Password</Text>
      {errors?.password && (
        <Text style={styles.error}>{errors?.password?.message}</Text>
      )}
      <Controller
        name="password"
        control={control}
        rules={{
          required: { value: true, message: "This field is required" },
          minLength: { value: 8, message: "Password must be >= 8 characters" },
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
      <Text style={styles?.label}>Confirm Password</Text>
      {errors?.confirmPassword &&
        errors?.confirmPassword?.type === "validate" && (
          <Text style={styles.error}>Both Fields' values should match!</Text>
        )}
      {errors?.confirmPassword &&
        errors?.confirmPassword?.type === "required" && (
          <Text style={styles.error}>{errors?.confirmPassword?.message}</Text>
        )}
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: { value: true, message: "This field is required" },
          validate: (value) => value === getValues("password"),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles?.input,
              errors?.confirmPassword && styles?.errorBorder,
            ]}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      <Button
        text={
          route.params?.mode === "change" ? "Change Password" : "Reset Password"
        }
        onPress={handleSubmit(onSubmit)}
      />
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

export default ResetPassword;

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
