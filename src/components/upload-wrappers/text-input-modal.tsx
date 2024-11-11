import React from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { BackButton } from "../buttons/buttons";
import { BoldMonoText } from "../text";
import { IS_IOS } from "../../constants/utils";

export function TextInputInnerModal({
  setShowModal,
  text,
  setText,
  confirm,
  modalTitle,
  placeholderText,
}: {
  setShowModal: any;
  text: string;
  setText: any;
  confirm: any;
  modalTitle?: string;
  placeholderText?: string;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
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
            <BoldMonoText style={{}}>
              {`${modalTitle ? modalTitle : `Edit`}`.toUpperCase()}
            </BoldMonoText>
            <View style={{ width: 30 }} />
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={IS_IOS ? "padding" : "height"}
            keyboardVerticalOffset={100}
          >
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    paddingVertical: 9,
                  }}
                >
                  <TextInput
                    style={[
                      {
                        fontFamily: Fonts.MonoSans,
                        width: "100%",
                        color: "white",
                        paddingLeft: 4,
                        fontSize: 18,
                      },
                    ]}
                    placeholder={placeholderText ? placeholderText : "Edit..."}
                    placeholderTextColor={colors.transparentWhite7}
                    cursorColor={"white"}
                    multiline={true}
                    value={text}
                    onChangeText={(text) => setText(text)}
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
                <BoldMonoText style={{ fontSize: 22 }}>SAVE</BoldMonoText>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
