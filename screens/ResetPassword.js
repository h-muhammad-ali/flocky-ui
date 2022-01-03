import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import { useForm, Controller } from "react-hook-form";

const ResetPassword = ({ navigation }) => {
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
  const onSubmit = (data) => {
    console.log("data", data);
    reset();
  };
  return (
    <View style={styles.container}>
      <Header text="Forgot Password?" navigation={() => navigation?.goBack()} />
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
          <Text style={styles.error}>Both Fields' values should match!"</Text>
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
      <Button text="Reset Password" onPress={handleSubmit(onSubmit)} />
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
