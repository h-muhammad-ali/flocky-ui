import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";

const SignIn = ({ navigation }) => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const onSubmit = (data) => {
    console.log("data", data);
    if (data?.email === "user@gmail.com") {
      navigation?.navigate("User Stack");
    }
    if (data?.email === "admin@gmail.com") {
      navigation?.navigate("User Stack", {
        screen: "User Panel",
        params: {
          screen: "Roles",
          params: { isAdmin: true },
        },
      });
    }
    if (data?.email === "flocky@gmail.com") {
      navigation?.navigate("Companies Management");
    }
    reset();
  };
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const focusHandler = (set) => {
    set(true);
  };

  const blurHandler = (onBlur, set) => {
    set(false);
    onBlur();
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles?.container}>
        <Header text="Log In" navigation={() => navigation?.goBack()} />
        <Text style={styles?.label}>Email Address</Text>
        {errors?.email && (
          <Text style={styles.error}>{errors?.email?.message}</Text>
        )}
        <Controller
          name="email"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
            pattern: { value: EMAIL_REGEX, message: "Not a valid email" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles?.input,
                errors?.email && styles?.errorBorder,
                focusEmail && { borderColor: "#5188E3" },
              ]}
              selectionColor={"#5188E3"}
              onChangeText={onChange}
              onFocus={() => focusHandler(setFocusEmail)}
              onBlur={() => blurHandler(onBlur, setFocusEmail)}
              value={value}
            />
          )}
        />
        <Text style={styles?.label}>Password</Text>
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
              style={[
                styles?.input,
                errors?.password && styles?.errorBorder,
                focusPassword && { borderColor: "#5188E3" },
              ]}
              secureTextEntry={true}
              selectionColor={"#5188E3"}
              onChangeText={onChange}
              onFocus={() => focusHandler(setFocusPassword)}
              onBlur={() => blurHandler(onBlur, setFocusPassword)}
              value={value}
            />
          )}
        />
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={() => {
            navigation?.navigate("Forgot Password");
          }}
        >
          <Text style={styles.links}>Forgot Password</Text>
        </TouchableOpacity>
        <Button text="Log In" onPress={handleSubmit(onSubmit)} />
        <View style={styles?.logIn}>
          <TouchableOpacity
            onPress={() => {
              navigation?.navigate("SignUp");
            }}
          >
            <Text style={styles?.links}>I don't have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet?.create({
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
  label: {
    marginBottom: 5,
    marginStart: 10,
    fontFamily: "NunitoSans-SemiBold",
  },
  logIn: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  links: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#758580",
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
});

export default SignIn;
