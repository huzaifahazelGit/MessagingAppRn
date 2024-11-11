import { useState } from "react";
import { Modal, Switch, View, TouchableOpacity } from "react-native";
import Popover from "react-native-popover-view";
import { BodyText, BoldMonoText } from "../../../components/text";

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { BackButton } from "../../../components/buttons/buttons";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import RAIChatListScreen from "./rai-list";

export default function RAINavBar({
  userSearchActive,
  setUserSearchActive,
  setNewSession,
  showHistory,
  setShowHistory,
}) {
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  return (
    <View>
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
          paddingBottom: 2,
        }}
      >
        <BackButton />

        <Popover
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}
          popoverStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          from={
            <TouchableOpacity
              onPress={() => setShowPopover(true)}
              style={{ height: 25 }}
            >
              <Feather name="more-horizontal" size={24} color={colors.blue} />
            </TouchableOpacity>
          }
        >
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 8,
                width: 160,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 12,
                borderRadius: 18,
                marginBottom: 6,
              }}
              onPress={() => {
                setNewSession("new");
                setShowPopover(false);
              }}
            >
              <BodyText style={{ color: "black" }}>New Chat</BodyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 8,
                width: 160,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 12,
                borderRadius: 18,
                marginBottom: 6,
              }}
              onPress={() => {
                setShowPopover(false);
                setTimeout(() => {
                  setShowHistory(true);
                }, 500);
              }}
            >
              <BodyText style={{ color: "black" }}>History</BodyText>
            </TouchableOpacity>
          </View>
        </Popover>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingHorizontal: 14,
        }}
      >
        {userSearchActive ? (
          <Popover
            isVisible={showInfoPopover}
            onRequestClose={() => setShowInfoPopover(false)}
            popoverStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            from={
              <TouchableOpacity
                onPress={() => setShowInfoPopover(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: -4,
                }}
              >
                <BoldMonoText style={{ color: colors.blue, marginRight: 3 }}>
                  APP ROCKET USER SEARCH
                </BoldMonoText>

                <Feather name="info" size={15} color={colors.blue} />
              </TouchableOpacity>
            }
          >
            <View style={{ maxWidth: SCREEN_WIDTH * 0.5 }}>
              <BodyText>
                Turn on user search where you are trying to search for a Realm
                user. Use RAI chat for other questions.
              </BodyText>
            </View>
          </Popover>
        ) : (
          <BoldMonoText style={{ marginTop: -4 }}>RAI CHAT</BoldMonoText>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Switch
            trackColor={{ false: "#3e3e3e", true: colors.blue }}
            thumbColor={colors.white}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setUserSearchActive(!userSearchActive);
            }}
            value={userSearchActive}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              marginTop: -4,
            }}
          />
        </View>
      </View>
    </View>
  );
}
