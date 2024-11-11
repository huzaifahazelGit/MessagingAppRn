import React from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SCREEN_HEIGHT } from "../../constants/utils";
import { BodyText, BoldMonoText, BoldText } from "../text";
import { colors } from "../../constants/colors";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function GenericModal({
  showModal,
  setShowModal,

  options,
}: {
  showModal: boolean;
  setShowModal: any;

  options: { title: string; onPress: any; icon?: any; subtext?: any }[];
}) {
  return (
    <Modal visible={showModal} transparent={true} animationType={"fade"}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.transparentBlack7 }}
          onPress={() => setShowModal(false)}
        ></TouchableOpacity>
        <View
          style={{
            minHeight: SCREEN_HEIGHT * 0.4,
            backgroundColor: "white",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 12,
              paddingBottom: 12,
              borderBottomColor: colors.gray,
              borderBottomWidth: 1,
              marginHorizontal: 12,
              marginBottom: 8,
            }}
          >
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Entypo name="chevron-down" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                  borderBottomColor: "rgba(0, 0, 0, 0.2)",
                  borderBottomWidth: 0.7,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.icon && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                        width: 20,
                        marginRight: 6,
                      }}
                    >
                      {item.icon}
                    </View>
                  )}
                  <BodyText
                    style={{
                      color: item.title.toLowerCase().includes("delete")
                        ? "red"
                        : "black",
                    }}
                  >
                    {item.title}
                  </BodyText>
                </View>
                {!item.title.toLowerCase().includes("delete") && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {item.subtext && (
                      <BodyText style={{ color: "black", marginRight: 4 }}>
                        {item.subtext}
                      </BodyText>
                    )}
                    <Ionicons
                      name="chevron-forward-outline"
                      size={16}
                      color="black"
                      style={{ opacity: 0.7 }}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
