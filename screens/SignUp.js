import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";

const Sign = () => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [gender, setGender] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyValue, setCompanyValue] = useState(null);
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
  };
  return (
    <View style={styles?.container}>
      <Header text="Sign In" />
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
                value={genderValue}
                items={gender}
                setOpen={setGenderOpen}
                setValue={setGenderValue}
                setItems={setGender}
                placeholder="Select Gender"
                placeholderStyle={styles?.placeholderStyles}
                onOpen={onGenderOpen}
                onChangeValue={onChange}
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
                value={companyValue}
                items={company}
                setOpen={setCompanyOpen}
                setValue={setCompanyValue}
                setItems={setComapny}
                placeholder="Select Company"
                placeholderStyle={styles?.placeholderStyles}
                loading={loading}
                activityIndicatorColor="#5188E3"
                searchable={true}
                searchPlaceholder="Search your company here..."
                onOpen={onCompanyOpen}
                onChangeValue={onChange}
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
            style={[styles?.input, errors?.email && styles?.errorBorder]}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
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
            ]}
            selectionColor={"#5188E3"}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text style={styles?.getStarted}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles?.terms}>
        By continuing, you agree to Flocky’s{" "}
        <Text style={styles?.links}>Terms & Conditions</Text> and{" "}
        <Text style={styles?.links}>Privacy Policy</Text>
      </Text>
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

export default Sign;
