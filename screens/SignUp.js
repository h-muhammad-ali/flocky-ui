import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ToastAndroid,
  Pressable,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/Header";
import { useForm, Controller } from "react-hook-form";
import Button from "../components/Button";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import useTogglePasswordVisibility from "../custom-hooks/useTogglePasswordVisibility";
import { MaterialCommunityIcons } from "@expo/vector-icons";

let apiCancelToken;
const SignUp = ({ navigation, route }) => {
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const EMAIL_PREFIX_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/;
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState([
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Prefer Not to Say", value: "N" },
  ]);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusName, setFocusName] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusCode, setFocusCode] = useState(false);
  const [orgID, setOrgID] = useState(0);
  const [domain, setDomain] = useState("");
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);
  const onCompanyOpen = useCallback(() => {
    setGenderOpen(false);
  }, []);
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
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
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid?.SHORT);
  };
  const onSubmit = (data) => {
    setLoading(true);
    const userData = {
      name: data?.name,
      password: data?.password,
      gender: data?.gender(),
      organization_id: data?.company(),
      email: domain
        ? `${data?.email.toLowerCase()}@${domain.toLowerCase()}`
        : data?.email.toLowerCase(),
      invitation_code: data?.invitationCode,
    };
    axios
      .post(
        `${BASE_URL}/auth/signup/token`,
        {
          email: userData?.email,
          organization_id: userData?.organization_id,
          invitation_code: userData?.invitation_code,
        },
        {
          timeout: 5000,
        }
      )
      .then((response) => {
        console.log(response);
        showToast("An email has been sent to you.");
        navigation?.navigate("AddCode", {
          confirmationCode: true,
          data: userData,
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

  const focusHandler = (set) => {
    set(true);
  };

  const blurHandler = (onBlur, set) => {
    set(false);
    onBlur();
  };

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    if (orgID !== 0) {
      axios
        .get(`${BASE_URL}/organization/${orgID}/domain`, {
          timeout: 5000,
          cancelToken: apiCancelToken?.token,
        })
        .then((response) => {
          setDomain(response?.data?.organization_domain);
        })
        .catch((error) => {
          if (error?.response?.status === 400) {
            setDomain("");
          } else if (error?.response) {
            setError(`${error?.response?.data}.`);
          } else if (error?.request) {
            setError("Server not reachable! Please try again later.");
          } else if (axios.isCancel(error)) {
            console.log(error?.message);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, [orgID]);

  useEffect(() => {
    apiCancelToken = axios.CancelToken.source();
    setLoading(true);
    axios
      .get(`${BASE_URL}/organization/`, {
        timeout: 5000,
      })
      .then((response) => {
        setCompany(response?.data ?? []);
      })
      .catch((error) => {
        if (error?.response) {
          setError(`${error?.response?.data}.`);
        } else if (error?.request) {
          setError("Network Error! Can't get all the organizations.");
        } else if (axios.isCancel(error)) {
          console.log(error?.message);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    return () =>
      apiCancelToken?.cancel(
        "API Request was cancelled because of component unmount."
      );
  }, []);

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
          text="Sign Up"
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
                    schema={{
                      label: "name",
                      value: "id",
                    }}
                    style={styles?.dropdown}
                    open={companyOpen}
                    value={value}
                    items={company}
                    setOpen={setCompanyOpen}
                    setValue={onChange}
                    setItems={setCompany}
                    placeholder="Select Company"
                    placeholderStyle={styles?.placeholderStyles}
                    searchable={true}
                    searchPlaceholder="Search your company here..."
                    onOpen={onCompanyOpen}
                    zIndex={1000}
                    zIndexInverse={3000}
                    onSelectItem={(item) => {
                      setOrgID(item?.id);
                    }}
                  />
                </View>
              )}
            />
          </View>
          <Text style={styles?.label}>Email Address</Text>
          {errors?.email && (
            <Text style={styles.error}>{errors?.email?.message}</Text>
          )}
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: { value: true, message: "This field is required" },
                pattern: {
                  value: domain ? EMAIL_PREFIX_REGEX : EMAIL_REGEX,
                  message: domain
                    ? "Not a valid email prefix"
                    : "Not a valid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles?.input,
                    { flex: 1 },
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
            {domain ? <Text style={styles?.domain}>@{domain}</Text> : <></>}
          </View>
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
          <Button text="Get Started" onPress={handleSubmit(onSubmit)} />
        </KeyboardAvoidingView>
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
  domain: {
    marginEnd: 10,
    color: "#5188E3",
    fontWeight: "bold",
    fontSize: 15,
    textAlignVertical: "center",
    height: 45,
    borderStyle: "solid",
    borderColor: "#5188E3",
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 5,
  },
});

export default SignUp;
