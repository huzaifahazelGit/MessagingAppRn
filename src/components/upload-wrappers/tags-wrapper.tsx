import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { IS_ANDROID, IS_IOS } from "../../constants/utils";
import { BackButton } from "../buttons/buttons";
import { BoldMonoText } from "../text";

export default function TagsWrapper({
  tags,
  setTags,
  children,
}: {
  tags: string[];
  setTags: any;
  children: any;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        {children}
      </TouchableOpacity>
      <Modal visible={showModal}>
        <TagPickerInnerModal
          setShowModal={setShowModal}
          confirm={() => {
            setShowModal(false);
          }}
          tags={tags}
          setTags={setTags}
        />
      </Modal>
    </View>
  );
}

export function TagPickerInnerModal({ setShowModal, confirm, tags, setTags }) {
  const [tagText, setTagText] = useState("");

  const addTag = () => {
    if (tags.length < 10) {
      setTags([...tags, tagText]);
      setTagText("");
    }
  };
  const valid = () => {
    return tagText && tagText.length > 2;
  };

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
        <BoldMonoText style={{}}>{`Add Tags`.toUpperCase()}</BoldMonoText>
        <View style={{ width: 30 }} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_IOS ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View
              style={
                IS_ANDROID
                  ? {
                      marginHorizontal: 20,

                      paddingHorizontal: 5,
                      paddingVertical: 7,
                      borderBottomWidth: 1,
                      borderBottomColor: "#fff",
                      marginTop: 0,
                      maxHeight: 60,
                      flexDirection: "row",
                      marginBottom: 12,
                      alignItems: "center",
                    }
                  : {
                      marginHorizontal: 20,
                      marginTop: 15,
                      paddingHorizontal: 5,
                      paddingVertical: 7,
                      borderBottomWidth: 1,
                      borderBottomColor: "#fff",
                      flexDirection: "row",
                      marginBottom: 12,
                      alignItems: "center",
                    }
              }
            >
              <TextInput
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontFamily: Fonts.MonoBold,
                  flex: 1,
                }}
                placeholder={"Tags"}
                placeholderTextColor={colors.transparentWhite6}
                selectionColor={colors.transparentWhite6}
                value={tagText}
                onChangeText={(text) => {
                  let input = text.replace(/[^a-zA-Z-]/g, "");
                  setTagText(input.toLowerCase().trim());
                }}
                keyboardAppearance={"dark"}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={{}} disabled={!valid()} onPress={addTag}>
                <Ionicons
                  name="add"
                  style={{ opacity: valid() ? 1 : 0.4 }}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <TagsList tags={tags} setTags={setTags} />
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
            <BoldMonoText style={{ fontSize: 22 }}>SAVE</BoldMonoText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function TagsList({
  tags,
  setTags,
  addable,
  onAdd,
  backgroundColor,
  textColor,
  containerStyles,
  border,
  tagContainerStyles,
}: {
  tags: string[];
  setTags: any;
  addable?: boolean;
  onAdd?: any;
  textColor?: string;
  backgroundColor?: string;
  containerStyles?: any;
  border?: boolean;
  tagContainerStyles?: any;
}) {
  return (
    <View
      style={
        addable
          ? { ...containerStyles }
          : {
              flexDirection: "row",
              flexWrap: "wrap",
              ...containerStyles,
            }
      }
    >
      {(tags || []).map((item, index) => (
        <View
          key={index}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: border
              ? "transparent"
              : backgroundColor
              ? backgroundColor
              : addable
              ? "transparent"
              : colors.purple,
            borderRadius: 12,
            flexDirection: "row",
            justifyContent: addable ? "flex-start" : "space-between",
            alignItems: "center",
            marginRight: 5,
            marginBottom: 5,
            borderWidth: border ? 1 : 0,
            borderColor: backgroundColor,
            ...tagContainerStyles,
          }}
        >
          {addable ? (
            <TouchableOpacity style={{}} onPress={() => onAdd(item)}>
              <Ionicons
                name="add"
                size={20}
                style={{ marginLeft: 8, marginRight: 6 }}
                color={textColor ? textColor : "white"}
              />
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <BoldMonoText
            style={{ color: textColor ? textColor : "white", fontSize: 13 }}
          >
            {item}
          </BoldMonoText>
          {addable ? (
            <View />
          ) : (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                setTags((tags || []).filter((tag) => tag != item));
              }}
            >
              <Ionicons
                name="close"
                size={18}
                style={{ marginLeft: 4, marginRight: 6 }}
                color={textColor ? textColor : "white"}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}
