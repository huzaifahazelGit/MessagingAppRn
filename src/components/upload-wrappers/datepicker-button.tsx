import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import DateInput from "../inputs/date-input";

export default function DatePickerButton({
  date,
  setDate,
  children,
  includeTime,
}) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (!date) {
            setDate(new Date());
          }
          setShowModal(true);
        }}
      >
        {children}
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true}>
        <DatePickerInnerModal
          setShowModal={setShowModal}
          includeTime={includeTime}
          date={date}
          setDate={setDate}
        />
      </Modal>
    </View>
  );
}

export function DatePickerInnerModal({
  setShowModal,
  includeTime,
  date,
  setDate,
}) {
  return (
    <View
      style={{
        flex: 1,

        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          height: 500,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 12,
            paddingBottom: 20,
            borderBottomColor: colors.gray,
            borderBottomWidth: 1,
            marginHorizontal: 12,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Entypo name="chevron-down" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <DateInput
            includeTime={includeTime}
            visible={true}
            value={date}
            setValue={setDate}
          />
        </View>
      </View>
    </View>
  );
}
