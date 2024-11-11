import React from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { IS_IOS } from "../../constants/utils";
import { TagsDropdown } from "../dropdowns/tags-dropdown";
import { BackButton } from "../buttons/buttons";
import { BoldMonoText } from "../text";
import { TagsList } from "./tags-wrapper";

export function TagsSearchInnerModal({ setShowModal, tags, setTags, confirm }) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <BackButton customBack={() => setShowModal(false)} />
        <BoldMonoText style={{}}>{`Select Tags`.toUpperCase()}</BoldMonoText>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_IOS ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                marginTop: 40,
                marginHorizontal: 20,
                zIndex: 2,
                backgroundColor: colors.black,
              }}
            >
              <TagsDropdown
                selectedTag={null}
                setSelectedTag={(tag) => {
                  if (tag) {
                    setTags([
                      ...(tags || []).filter((item) => item != tag.title),
                      tag.title,
                    ]);
                  }
                }}
              />
            </View>
          </View>
          <View>
            <View
              style={{ zIndex: 1, paddingHorizontal: 20, paddingBottom: 10 }}
            >
              <TagsList tags={tags || []} setTags={setTags} />
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
              <BoldMonoText style={{ fontSize: 22 }}>SAVE</BoldMonoText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
