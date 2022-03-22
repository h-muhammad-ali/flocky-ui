import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { useForm, Controller } from "react-hook-form";

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
  const onSubmit = (data) => {
    console.log("data", data);
    reset();
    navigation?.navigate("Reset Password");
  };
  return (
    <View style={styles.container}>
      <Header text="Change Password" navigation={() => navigation?.goBack()} />
      <Text style={styles?.label}>Enter Current Password</Text>
      {errors?.password && (
        <Text style={styles.error}>{errors?.password?.message}</Text>
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
