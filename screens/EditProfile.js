import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";

const EditProfile = ({ navigation }) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState([
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Prefer Not to Say", value: "N" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusName, setFocusName] = useState(false);
  const [imgURL, setImgURL] = useState("");
  const { jwt } = useSelector((state) => state?.currentUser);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      gender: "",
      company: "",
      email: "",
    },
  });

  const focusHandler = (set) => {
    set(true);
  };

  const blurHandler = (onBlur, set) => {
    set(false);
    onBlur();
  };

  const onSubmit = (data) => {
    console.log("data", data);
    reset();
    navigation?.navigate("Add Photo", {
      isEdit: true,
      imageURL: imgURL,
      updatedData: {
        gender: data?.gender(),
        name: data?.name,
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/account/user/details`, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        const resp = response?.data;
        const info = {
          name: resp?.name,
          gender: resp?.gender,
          company: resp?.organization?.name,
          email: resp?.email,
        };
        setImgURL(resp?.imgURL);
        reset(info);
      })
      .catch((error) => {
        console?.log(error);
        if (error?.response) {
          setError(
            `${error?.response?.data}. Status Code: ${error?.response?.status}`
          );
        } else if (error?.request) {
          setError("Network Error! Please try again later.");
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reset]);

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
        <KeyboardAvoidingView behavior="padding">
          <Header text="Edit Profile" navigation={() => navigation?.goBack()} />
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
            <Text style={styles?.label}>Institute/Organization</Text>
            <Controller
              name="company"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles?.input}
                  value={value}
                  editable={false}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
          <Text style={styles?.label}>Email Address</Text>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles?.input}
                value={value}
                editable={false}
                onChangeText={onChange}
              />
            )}
          />
        </KeyboardAvoidingView>
        <View style={{ flex: 1, marginTop: 10 }}>
          <Button text="Update Profile" onPress={handleSubmit(onSubmit)} />
        </View>
        <View>
          <ErrorDialog
            visible={!!error}
            errorHeader={"Error"}
            errorDescription={error}
            clearError={() => {
              setError("");
              navigation?.navigate("Roles");
            }}
          />
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

export default EditProfile;
