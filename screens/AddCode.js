import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Button from "../components/Button";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";

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
  const onSubmit = (data) => {
    console.log("data", data);
    reset();
    route?.params?.resetCode
      ? navigation?.navigate("Reset Password")
      : navigation?.navigate("AdminSignUp");
  };
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
          <TouchableOpacity>
            <Text style={styles?.link}>Resend!</Text>
          </TouchableOpacity>
        </View>
        <Button text="Verify" onPress={handleSubmit(onSubmit)} />
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
