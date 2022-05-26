import React, { useState, useEffect } from "react";

import { TextInputMask } from "react-native-masked-text";
import { TouchableRipple, TextInput, Portal, Button } from "react-native-paper";

import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Platform, View } from "react-native";

const DatePicker = ({ value, onValueChange, label, inputStyles, containerStyle, disabled }) => {
  const [android, setAndroid] = useState(false);
  const [ios, setIos] = useState(false);
  const [text, setText] = React.useState(moment(value).format("DD/MM/YYYY"));

  React.useEffect(() => {
    const date = moment(value).format("YYYY-MM-DD");
    const showDate = date.split("-")[2] + "/" + date.split("-")[1] + "/" + date.split("-")[0];
    setText(showDate);
  }, [value]);

  return (
    // <TouchableRipple style={containerStyle} onPress={() => setShow(true)}>
    <>
      {android && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setIos(false);
            setAndroid(false);
            onValueChange(moment(selectedDate).format("YYYY-MM-DD"));
          }}
        />
      )}

      {ios && (
        <Portal>
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              position: "absolute",
              bottom: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                backgroundColor: "#E5E4E2",
              }}
            >
              <Button
                labelStyle={{ fontSize: 18 }}
                mode="text"
                uppercase={false}
                color="#007AFF"
                onPress={() => setIos(false)}
              >
                Done
              </Button>
            </View>
            <DateTimePicker
              testID="dateTimePicker"
              value={value ? new Date(value) : new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                onValueChange(moment(selectedDate).format("YYYY-MM-DD"));
              }}
            />
          </View>
        </Portal>
      )}

      <TextInput
        render={(props) => (
          <TextInputMask
            {...props}
            type={"custom"}
            options={{
              mask: "99/99/9999",
            }}
          />
        )}
        right={
          <TextInput.Icon
            disabled={disabled}
            theme={{ colors: { text: "#22356A" } }}
            size={30}
            style={{ marginBottom: 0 }}
            name="calendar"
            onPress={() => {
              if (Platform.OS == "ios") {
                setIos(true);
              } else {
                setAndroid(true);
              }
            }}
            forceTextInputFocus={false}
          />
        }
        onChangeText={(val) => {
          setText(val);
        }}
        onBlur={() => {
          if (text.length === 10) {
            const setDate =
              text.split("/")[2] + "-" + text.split("/")[1] + "-" + text.split("/")[0];
            onValueChange(moment(setDate).format("YYYY-MM-DD"));
          } else {
            setText(moment(value).format("DD/MM/YYYY"));
          }
        }}
        keyboardType="number-pad"
        maxLength={10}
        value={text}
        mode="flat"
        label={label}
        disabled={disabled}
        style={[inputStyles]}
      />
    </>
    // </TouchableRipple>
  );
};

export default DatePicker;
