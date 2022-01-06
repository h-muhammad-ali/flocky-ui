import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";

const SignUp = ({ navigation, route }) => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [company, setComapny] = useState([
    { label: "PUCIT", value: "pucit" },
    { label: "UCP", value: "ucp" },
    { label: "UET", value: "uet" },
  ]);
  const [loading, setLoading] = useState(false);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const onCompanyOpen = useCallback(() => {
    setGenderOpen(false);
  }, []);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      password: "",
      gender: "",
      company: "",
      email: "",
      invitationCode: "",
    },
  });
  const onSubmit = (data) => {
    console.log("data", data);
    reset();
  };

  const [focusName, setFocusName] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusCode, setFocusCode] = useState(false);
  const [checked, setChecked] = useState(false);

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
      <View style={styles.container}>
        <Header
          text={route.params?.isEdit ? "Edit Profile" : "Sign Up"}
          navigation={() => navigation?.goBack()}
        />
        <KeyboardAvoidingView behavior="padding">
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
                value: /^[A-Za-z]+( [A-Za-z]+)*$/,
                message: "Name can only include Alphabets",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles?.input,
                  errors?.name && styles?.errorBorder,
                  focusName && { borderColor: "#5188E3" },
                ]}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                onFocus={() => focusHandler(setFocusName)}
                onBlur={() => blurHandler(onBlur, setFocusName)}
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

          <View>
            <Text style={styles?.label}>Gender</Text>
            {errors?.gender && (
              <Text style={styles?.error}>{errors?.gender?.message}</Text>
            )}
            <Controller
              name="gender"
              control={control}
              rules={{
                required: { value: true, message: "This field is required" },
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles?.dropdownGender}>
                  <DropDownPicker
                    style={styles?.dropdown}
                    open={genderOpen}
                    value={value}
                    items={gender}
                    setOpen={setGenderOpen}
                    setValue={onChange}
                    setItems={setGender}
                    placeholder="Select Gender"
                    placeholderStyle={styles?.placeholderStyles}
                    onOpen={onGenderOpen}
                    zIndex={3000}
                    zIndexInverse={1000}
                  />
                </View>
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
              render={({ field: { onChange, value } }) => (
                <View style={styles?.dropdownCompany}>
                  <DropDownPicker
                    style={styles?.dropdown}
                    open={companyOpen}
                    value={value}
                    items={company}
                    setOpen={setCompanyOpen}
                    setValue={onChange}
                    setItems={setComapny}
                    placeholder="Select Company"
                    placeholderStyle={styles?.placeholderStyles}
                    loading={loading}
                    activityIndicatorColor="#5188E3"
                    searchable={true}
                    searchPlaceholder="Search your company here..."
                    onOpen={onCompanyOpen}
                    zIndex={1000}
                    zIndexInverse={3000}
                  />
                </View>
              )}
            />
          </View>
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
          <Text style={styles?.label}>Invitation Code</Text>
          {errors?.invitationCode && (
            <Text style={styles?.error}>{errors?.invitationCode?.message}</Text>
          )}
          <Controller
            name="invitationCode"
            control={control}
            rules={{
              required: { value: true, message: "This field is required" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles?.input,
                  errors?.invitationCode && styles?.errorBorder,
                  focusCode && { borderColor: "#5188E3" },
                ]}
                selectionColor={"#5188E3"}
                onChangeText={onChange}
                onFocus={() => focusHandler(setFocusCode)}
                onBlur={() => blurHandler(onBlur, setFocusCode)}
                value={value}
              />
            )}
          />
        </KeyboardAvoidingView>
        <View style={styles?.checkboxContainer}>
          <TouchableOpacity
            onPress={() => {
              setChecked(!checked);
            }}
          >
            <Ionicons
              name={checked ? "checkbox" : "square-outline"}
              size={25}
              color={"#5188E3"}
            />
          </TouchableOpacity>
          <Text>Travel Only with Same Gender</Text>
        </View>
        {route.params?.isEdit ? (
          <Button text="Update Profile" onPress={handleSubmit(onSubmit)} />
        ) : (
          <>
            <Button text="Get Started" onPress={handleSubmit(onSubmit)} />
            <Text style={styles?.terms}>
              By continuing, you agree to Flocky’s{" "}
              <Text style={styles?.links}>Terms & Conditions</Text> and{" "}
              <Text style={styles?.links}>Privacy Policy</Text>
            </Text>
            <View style={styles?.logIn}>
              <TouchableOpacity
                onPress={() => {
                  navigation?.navigate("LogIn");
                }}
              >
                <Text style={styles?.links}>I have an account</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  terms: {
    color: "#758580",
    textAlign: "center",
    marginTop: 10,
    marginHorizontal: 70,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 10,
  },
});

export default SignUp;
