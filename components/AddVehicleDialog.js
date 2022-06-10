import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Dialog from "react-native-dialog";
import { useForm, Controller } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { BASE_URL } from "../config/baseURL";
import ErrorDialog from "../components/ErrorDialog";
import { useSelector } from "react-redux";

const AddVehicleDialog = ({ setVehicleAdded, visible, setVisibility }) => {
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(null);
  const [type, setType] = useState([
    { label: "Bike", value: "B" },
    { label: "Car", value: "C" },
  ]);
  const {
    handleSubmit,
    control,
    formState,
    formState: { isSubmitSuccessful, errors },
    reset,
  } = useForm({
    defaultValues: {
      model: "",
      make: "",
      color: "",
      plateNumber: "",
      type: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState({});
  const { jwt } = useSelector((state) => state?.currentUser);
  const onSubmit = (data) => {
    setLoading(true);
    const vehicleData = {
      type: data?.type,
      model: data?.model,
      make: data?.make,
      color: data?.color,
      registration_no: data?.plateNumber,
    };
    axios
      .post(`${BASE_URL}/vehicle/add`, vehicleData, {
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        console.log(response);
        setSubmittedData(data);
        setVehicleAdded(true);
        setVisibility(false);
      })
      .catch((error) => {
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
  };

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ ...submittedData });
    }
  }, [formState, submittedData, reset]);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#5188E3" />
      </View>
    );
  }
  return (
    <View>
      <Dialog.Container visible={visible} headerStyle={styles?.container}>
        <Dialog.Title style={styles.headerText}>Add Vehicle</Dialog.Title>
        {(errors?.type ||
          errors?.make ||
          errors?.model ||
          errors?.color ||
          errors?.plateNumber) && (
          <Dialog.Description style={styles.error}>
            *Please give input for all the given fields
          </Dialog.Description>
        )}
        <Controller
          name="type"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles?.dropdownType}>
              <DropDownPicker
                style={styles?.dropdown}
                open={typeOpen}
                value={typeValue}
                items={type}
                setOpen={setTypeOpen}
                setValue={setTypeValue}
                setItems={setType}
                placeholder="Select Vehicle Type"
                onChangeValue={onChange}
              />
            </View>
          )}
        />
        <Controller
          name="make"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dialog.Input
              style={errors?.make && styles?.errorBorder}
              selectionColor={"#5188E3"}
              placeholder="Make"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Controller
          name="model"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dialog.Input
              style={errors?.model && styles?.errorBorder}
              selectionColor={"#5188E3"}
              placeholder="Model Name"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dialog.Input
              style={errors?.color && styles?.errorBorder}
              selectionColor={"#5188E3"}
              placeholder="Color"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        <Controller
          name="plateNumber"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dialog.Input
              style={errors?.plateNumber && styles?.errorBorder}
              selectionColor={"#5188E3"}
              placeholder="Registeration Number"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Dialog.Button
          color="red"
          label="Cancel"
          onPress={() => {
            reset();
            setVisibility(false);
          }}
        />
        <Dialog.Button
          color="#5188E3"
          label="Add Vehicle"
          onPress={handleSubmit(onSubmit)}
        />
      </Dialog.Container>
      <ErrorDialog
        visible={!!error}
        errorHeader={"Error"}
        errorDescription={error}
        clearError={() => {
          setError("");
        }}
      />
    </View>
  );
};

export default AddVehicleDialog;

const styles = StyleSheet?.create({
  dropdownType: {
    marginHorizontal: 7,
    width: "55%",
    marginBottom: 10,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  containerStyle: {},
  headerText: {
    color: "#5188E3",
    textAlign: "center",
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
