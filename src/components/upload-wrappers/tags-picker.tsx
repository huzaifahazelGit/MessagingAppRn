import React, { useState } from "react";
import { Modal, SafeAreaView, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { BackButton } from "../buttons/buttons";
import { BoldMonoText, BoldText } from "../text";
import TagSelector from "../buttons/tag-selector";

export function TagsPickerInnerModal({
  setShowModal,
  options,
  tags,
  setTags,
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
        <BoldMonoText style={{}}>{`Select`.toUpperCase()}</BoldMonoText>
        <View style={{ width: 30 }} />
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginTop: 50, paddingHorizontal: 20 }}>
          <View style={{}}>
            <TagSelector
              options={options}
              selectedTags={tags}
              setSelectedTags={setTags}
            />
          </View>
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
          <BoldMonoText style={{ fontSize: 22 }}>ADD</BoldMonoText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
