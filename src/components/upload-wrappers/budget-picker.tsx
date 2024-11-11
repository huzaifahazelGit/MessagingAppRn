import React, { useState } from "react";
import { Modal, SafeAreaView, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { BackButton } from "../buttons/buttons";
import { BoldMonoText, BoldText } from "../text";

export default function BudgetPickerButton({ budget, setBudget, children }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        {children}
      </TouchableOpacity>
      <Modal visible={showModal}>
        <BudgetPickerINnerModal
          setShowModal={setShowModal}
          budget={budget}
          setBudget={setBudget}
          confirm={() => {
            setShowModal(false);
          }}
        />
      </Modal>
    </View>
  );
}

export function BudgetPickerINnerModal({
  setShowModal,
  budget,
  setBudget,
  confirm,
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <BackButton customBack={() => setShowModal(false)} />
        <BoldMonoText style={{}}>{`Budget`.toUpperCase()}</BoldMonoText>
        <View style={{ width: 30 }} />
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <BoldMonoText
            style={{
              color: colors.purple,
              fontSize: 30,
            }}
          >{`$${budget.min} -`}</BoldMonoText>
          <BoldMonoText
            style={{
              color: colors.blue,
              fontSize: 30,
            }}
          >{`$${budget.max}`}</BoldMonoText>
        </View>

        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 25,
            marginHorizontal: 20,
            marginBottom: 8,
          }}
          onPress={() => {
            confirm();
          }}
        >
          <BoldMonoText style={{ fontSize: 22 }}>CONFIRM</BoldMonoText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
