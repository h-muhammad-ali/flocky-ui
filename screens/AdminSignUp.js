import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import ErrorDialog from "../components/ErrorDialog";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";

const AdminSignUp = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState([
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Prefer Not to Say", value: "N" },
  ]);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      gender: "",
    },
  });
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid?.SHORT);
  };
  const onSubmit = (data) => {
    setLoading(true);
    const orgData = {
      organization_name: route?.params?.company,
      email_domain: route?.params?.domain,
      admin: {
        email: route?.params?.email,
        name: data?.name,
        gender: data?.gender(),
        password: route?.params?.password,
      },
      location: {
        coordinates: {
          latitude: route.params?.location?.coords?.lat,
          longitude: route.params?.location?.coords?.lng,
        },
        formatted_address: route.params?.location?.formatted_address,
        place_id: route.params?.location?.place_id,
        short_address: route.params?.location?.short_address,
      },
    };
    axios
      .post(
        `${BASE_URL}/organization/register/token`,
        { email: orgData?.admin?.email },
        {
          timeout: 5000,
        }
      )
      .then((response) => {
        console.log(response);
        showToast("An email has been sent to you.");
        navigation?.navigate("AddCode", {
          adminConfirmationCode: true,
          orgData: orgData,
        });
      })
      .catch((error) => {
        if (error?.response) {
          setError(`${error?.response?.data}.`);
        } else if (error?.request) {
          setError("Server not reachable! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [focusName, setFocusName] = useState(false);

  const focusHandler = (set) => {
    set(true);
  };

  const blurHandler = (onBlur, set) => {
    set(false);
    onBlur();
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Header
          text="Admin Information"
          navigation={() => navigation?.goBack()}
          isBackButtonVisible={true}
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
                    dropDownDirection="TOP"
                    style={styles?.dropdown}
                    open={genderOpen}
                    value={value}
                    items={gender}
                    setOpen={setGenderOpen}
                    setValue={onChange}
                    setItems={setGender}
                    placeholder="Select Gender"
                    placeholderStyle={styles?.placeholderStyles}
                    zIndex={3000}
                    zIndexInverse={1000}
                  />
                </View>
              )}
            />
          </View>
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
        </KeyboardAvoidingView>
        <Button text="Get Started" onPress={handleSubmit(onSubmit)} />
        <Text style={styles?.terms}>
          By continuing, you agree to Flocky’s{" "}
          <Text style={styles?.links}>Terms & Conditions</Text> and{" "}
          <Text style={styles?.links}>Privacy Policy</Text>
        </Text>
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
