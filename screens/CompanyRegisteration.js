import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";
import useTogglePasswordVisibility from "../custom-hooks/useTogglePasswordVisibility";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CompanyRegisteration = ({ navigation, route }) => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const DOMAIN_REGEX =
    /^((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      company: "",
      email: "",
      domain: "",
    },
  });
  const onSubmit = (data) => {
    reset();
    navigation?.navigate("SelectOrganizationLocation", {
      origin: "CompanyLocation",
      company: data?.company,
      password: data?.password,
      email: data?.email.toLowerCase(),
      domain: data?.domain ? data?.domain.toLowerCase() : "",
    });
  };
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusCompany, setFocusCompany] = useState(false);
  const [focusDomain, setFocusDomain] = useState(false);
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
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
        <Header
          text={"Company Registeration"}
          navigation={() => navigation?.goBack()}
          isBackButtonVisible={true}
        />
        <KeyboardAvoidingView behavior="padding">
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
                style={[
                  styles?.input,
                  errors?.company && styles?.errorBorder,
                  focusCompany && { borderColor: "#5188E3" },
                ]}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                onFocus={() => focusHandler(setFocusCompany)}
                onBlur={() => blurHandler(onBlur, setFocusCompany)}
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
              <View
                style={[
                  styles?.input,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                  },
                  errors?.password && styles?.errorBorder,
                  focusPassword && { borderColor: "#5188E3" },
                ]}
                onFocus={() => focusHandler(setFocusPassword)}
                onBlur={() => blurHandler(onBlur, setFocusPassword)}
              >
                <TextInput
                  style={{
                    fontSize: 15,
                    height: 45,
                    flex: 1,
                    marginEnd: 5,
                  }}
                  secureTextEntry={passwordVisibility}
                  selectionColor={"#5188E3"}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
                <Pressable onPress={handlePasswordVisibility}>
                  <MaterialCommunityIcons
                    name={rightIcon}
                    size={22}
                    color="#232323"
                  />
                </Pressable>
              </View>
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
                autoCapitalize="none"
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
              <View
                style={[
                  styles?.input,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 10,
                  },
                  errors?.domain && styles?.errorBorder,
                  focusDomain && { borderColor: "#5188E3" },
                ]}
                onFocus={() => focusHandler(setFocusDomain)}
                onBlur={() => blurHandler(onBlur, setFocusDomain)}
              >
                <Text
                  style={[
                    { fontFamily: "NunitoSans-Bold", color: "grey" },
                    focusDomain && { color: "black" },
                  ]}
                >
                  @
                </Text>
                <TextInput
                  style={{
                    fontSize: 15,
                    height: 45,
                    flex: 1,
                    marginEnd: 5,
                  }}
                  selectionColor={"#5188E3"}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              </View>
            )}
          />
        </KeyboardAvoidingView>
        <Button text="Continue" onPress={handleSubmit(onSubmit)} />
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
    paddingEnd: 5,
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    marginStart: 10,
    fontFamily: "NunitoSans-SemiBold",
  },
  placeholderStyles: {
    color: "grey",
  },
  dropdownGender: {
    marginHorizontal: 10,
    width: "50%",
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 45,
    backgroundColor: "#f2f2f2",
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

export default CompanyRegisteration;
