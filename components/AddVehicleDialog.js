import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";
import { useForm, Controller } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";

const AddVehicleDialog = ({ visible, setVisibility }) => {
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(null);
  const [type, setType] = useState([
    { label: "Bike", value: "bike" },
    { label: "Car", value: "car" },
  ]);
  const {
    handleSubmit,
    control,
    formState,
    formState: { isSubmitSuccessful },
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
  const [submittedData, setSubmittedData] = useState({});
  const onSubmit = (data) => {
    console.log("data", data);
    setSubmittedData(data);
    setVisibility(false);
  };

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ ...submittedData });
    }
  }, [formState, submittedData, reset]);

  return (
    <View>
      <Dialog.Container visible={visible} headerStyle={styles?.container}>
        <Dialog.Title style={styles.headerText}>Add Vehicle</Dialog.Title>
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
              selectionColor={"#5188E3"}
              placeholder="Model Name"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        {/* <Controller
          name="year"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dialog.Input
              selectionColor={"#5188E3"}
              placeholder="Year"
              keyboardType="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        /> */}

        <Controller
          name="color"
          control={control}
          rules={{
            required: { value: true, message: "This field is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Dialog.Input
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
            setVisibility(false);
          }}
        />
        <Dialog.Button
          color="#5188E3"
          label="Add Vehicle"
          onPress={handleSubmit(onSubmit)}
        />
      </Dialog.Container>
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
});
