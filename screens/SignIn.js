import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";

const SignIn = () => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const onSubmit = (data) => {
    console.log("data", data);
  };
  return (
    <View style={styles?.container}>
      <Header text="Log In" />
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
            style={[styles?.input, errors?.email && styles?.errorBorder]}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
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
          minLength: { value: 8, message: "Password must be >= 8 characters" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles?.input, errors?.password && styles?.errorBorder]}
            secureTextEntry={true}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      <TouchableOpacity>
        <Text style={styles.links}>Forgot Password</Text>
      </TouchableOpacity>
      <Button text="Log In" onPress={handleSubmit(onSubmit)} />

      <TouchableOpacity style={styles?.logIn}>
        <Text style={styles?.links}>I have an account</Text>
      </TouchableOpacity>
    </View>
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
  },
  placeholderStyles: {
    color: "grey",
  },
  dropdownGender: {
    marginHorizontal: 10,
    width: "50%",
    marginBottom: 15,
  },
  dropdownCompany: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  getStarted: {
    backgroundColor: "#5188E3",
    color: "white",
    textAlign: "center",
    marginHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 20,
  },
  terms: {
    color: "#758580",
    textAlign: "center",
    marginTop: 10,
    marginHorizontal: 70,
  },
  logIn: {
    flex: 1,
    justifyContent: "flex-end",
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
