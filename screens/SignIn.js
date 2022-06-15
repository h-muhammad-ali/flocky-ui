import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { setCurrentUserJWT } from "../redux/currentUser/currentUserActions";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import useTogglePasswordVisibility from "../custom-hooks/useTogglePasswordVisibility";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignIn = ({ navigation }) => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/auth/signin`,
        {
          email: data?.email.toLowerCase(),
          password: data?.password,
        },
        {
          timeout: 5000,
        }
      )
      .then((response) => {
        dispatch(setCurrentUserJWT(response?.data));
        reset();
      })
      .catch((error) => {
        if (error?.response) {
          setError(
            `${error?.response?.data}.`
          );
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
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
      <View style={styles?.container}>
        <Header
          text="Log In"
          navigation={() => navigation?.goBack()}
          isBackButtonVisible={true}
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
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={() => {
            navigation?.navigate("Forgot Password");
          }}
        >
          <Text style={styles.links}>Forgot Password</Text>
        </TouchableOpacity>
        <Button text="Log In" onPress={handleSubmit(onSubmit)} />
        <View style={styles?.logIn}>
          <TouchableOpacity
            onPress={() => {
              navigation?.navigate("SignUp");
            }}
          >
            <Text style={styles?.links}>I don't have an account</Text>
          </TouchableOpacity>
          {!!error ? (
            <ErrorDialog
              visible={!!error}
              errorHeader={"Error"}
              errorDescription={error}
              clearError={() => {
                setError("");
              }}
            />
          ) : (
            <></>
          )}
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
    paddingEnd: 5,
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    marginStart: 10,
    fontFamily: "NunitoSans-SemiBold",
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
});

export default SignIn;
