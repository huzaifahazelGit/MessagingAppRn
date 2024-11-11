import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { View } from "react-native";
import { IS_ANDROID } from "../../constants/utils";

export default function DateInput({
  visible,
  value,
  setValue,
  includeTime,
}: {
  visible: boolean;
  value: Date;
  setValue: any;
  includeTime: boolean;
}) {
  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;

    if (type == "set") {
      setValue(date);
    }
  };

  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {includeTime ? (
          <RNDateTimePicker
            mode={"datetime"}
            display="inline"
            value={value}
            onChange={setDate}
            themeVariant={!IS_ANDROID ? "light" : undefined}
          />
        ) : (
          <RNDateTimePicker
            display="inline"
            value={value}
            onChange={setDate}
            themeVariant={!IS_ANDROID ? "light" : undefined}
          />
        )}
      </View>
    </View>
  );
}
