import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Button from "../components/Button";
import Header from "../components/Header";
import ResendEmailButton from "../components/ResendEmailButton";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import useMountedState from "../custom-hooks/useMountedState";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);
  const [activeResend, setActiveResend] = useState(false);
  const isMounted = useMountedState();
  let resendTimerInterval;
  const calculateTimeLeft = useCallback(
    (finalTime) => {
      if (isMounted()) {
        const difference = finalTime - +new Date();
        if (difference >= 0) {
          setTimeLeft(Math.round(difference / 1000));
        } else {
          setTimeLeft(null);
          clearInterval(resendTimerInterval);
          setActiveResend(true);
        }
      }
    },
    [isMounted]
  );
  const triggerTimer = useCallback(
    (targetTimeInSeconds = 60) => {
      if (isMounted()) {
        setTargetTime(targetTimeInSeconds);
        setActiveResend(false);
        const finalTime = +new Date() + targetTimeInSeconds * 1000;
        resendTimerInterval = setInterval(
          () => (calculateTimeLeft(finalTime), 1000)
        );
      }
    },
    [isMounted]
  );

  useEffect(() => {
    triggerTimer();
    return () => clearInterval(resendTimerInterval);
  }, []);

  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid?.SHORT);
  };
  const onSubmit = (data) => {
    console.log("data", data);
    reset();
    if (route.params?.confirmationCode) {
      setLoading(true);
      const userData = { ...route.params?.data, token: data?.code };
      axios
        .post(`${BASE_URL}/auth/signup`, userData, {
          timeout: 5000,
        })
        .then((response) => {
          console.log(response);
          axios
            .post(
              `${BASE_URL}/auth/signin`,
              {
                email: userData?.email,
                password: userData?.password,
              },
              {
                timeout: 5000,
              }
            )
            .then((response) => {
              console.log(response);
              navigation.reset({
                index: 2,
                routes: [
                  { name: "MainMenu" },
                  { name: "SignUp" },
                  {
                    name: "Add Photo",
                    params: {
                      jwt: response?.data,
                    },
                  },
                ],
              });
              reset();
            })
            .catch((error) => {
              if (error?.response) {
                setAuthError(
                  `${error?.response?.data}. Status Code: ${error?.response?.status}`
                );
              } else if (error?.request) {
                setAuthError("Server not reachable! Please try again later.");
              } else {
                console.log(error);
              }
            })
            .finally(() => {});
        })
        .catch((error) => {
          if (error?.response) {
            setAuthError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
            );
          } else if (error?.request) {
            setAuthError("Server not reachable! Please try again later.");
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      route.params?.resetCode
        ? navigation?.navigate("Reset Password", {
            code: data?.code,
            email: route.params?.email,
          })
        : navigation?.navigate("AdminSignUp", {
            code: data?.code,
          });
    }
  };

  const resendHandler = () => {
    if (route.params?.confirmationCode) {
      setLoading(true);
      axios
        .post(
          `${BASE_URL}/auth/signup/token`,
          { email: route.params?.data?.email },
          {
            timeout: 5000,
          }
        )
        .then((response) => {
          console.log(response);
          triggerTimer();
          showToast("An email has been sent to you.");
        })
        .catch((error) => {
          if (error?.response) {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
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
    } else {
      const data = {
        email: route.params?.email,
      };
      setLoading(true);
      axios
        .post(`${BASE_URL}/auth/password/reset/token`, data, {
          timeout: 5000,
        })
        .then((response) => {
          reset();
          triggerTimer();
          showToast("Email Sent!");
        })
        .catch((error) => {
          if (error?.response) {
            setError(
              `${error?.response?.data}. Status Code: ${error?.response?.status}`
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
    }
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
          text="Add Verification Code"
          navigation={() => navigation?.goBack()}
          isBackButtonVisible={true}
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
        <ResendEmailButton
          resendHandler={() => {
            resendHandler();
          }}
          activeResend={activeResend}
          timeLeft={timeLeft}
          targetTime={targetTime}
        />
        <Button text="Verify" onPress={handleSubmit(onSubmit)} />
        <View>
          <ErrorDialog
            visible={!!error || !!authError}
            errorHeader={"Error!"}
            errorDescription={!!error ? error : authError}
            clearError={() => {
              !!error
                ? setError("")
                : navigation.reset({
                    index: 1,
                    routes: [{ name: "MainMenu" }, { name: "SignUp" }],
                  });
            }}
          />
        </View>
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
  text: {
    fontFamily: "NunitoSans-Bold",
    fontSize: 20,
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
