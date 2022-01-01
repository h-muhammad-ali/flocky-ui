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

const AdminSignUp = ({ navigation }) => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const DOMAIN_REGEX =
    /^@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      password: "",
      company: "",
      email: "",
      domain: "",
    },
  });
  const onSubmit = (data) => {
    console.log("data", data);
    reset();
    navigation?.navigate("VerificationFinished");
  };
  return (
    <View style={styles?.container}>
      <Header text="Company Registeration" />
      <Text style={styles?.label}>Name</Text>
      {errors?.name && (
        <Text style={styles?.error}>{errors?.name?.message}</Text>
      )}
      <Controller
        name="name"
        control={control}
        rules={{
          required: { value: true, message: "This field is required" },
          pattern: {
            value: /^[A-Za-z]+$/,
            message: "Name can only include Alphabets",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles?.input, errors?.name && styles?.errorBorder]}
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
      <Text style={styles?.label}>Institute/Organization</Text>
      {errors?.company && (
        <Text style={styles?.error}>{errors?.company?.message}</Text>
      )}
      <Controller
        name="company"
        control={control}
        rules={{
          required: { value: true, message: "This field is required" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles?.input, errors?.company && styles?.errorBorder]}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
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
      <Text style={styles?.label}>Company's Domain(Optional)</Text>
      {errors?.domain && (
        <Text style={styles?.error}>{errors?.domain?.message}</Text>
      )}
      <Controller
        name="domain"
        control={control}
        rules={{
          pattern: { value: DOMAIN_REGEX, message: "Not a valid domain." },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles?.input, errors?.domain && styles?.errorBorder]}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      <Button text="Continue" onPress={handleSubmit(onSubmit)} />
      <Text style={styles?.terms}>
        By continuing, you agree to Flocky’s{" "}
        <Text style={styles?.links}>Terms & Conditions</Text> and{" "}
        <Text style={styles?.links}>Privacy Policy</Text>
      </Text>
      <TouchableOpacity
        style={styles?.logIn}
        onPress={() => {
          navigation?.navigate("LogIn");
        }}
      >
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
    height: 45,
    backgroundColor: "#f2f2f2",
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

export default AdminSignUp;
