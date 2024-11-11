import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React from "react";
import { FlatList, SafeAreaView, TouchableOpacity, View } from "react-native";
import { BoldMonoText, LightText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { DEFAULT_ID, IS_ANDROID } from "../../../constants/utils";
import { useMe, useMySearchSessions } from "../../../hooks/useMe";

export default function RAIChatListScreen({ setNewSession, closeScreen }) {
  const me = useMe();
  const navigation = useNavigation();
  const userId = me && me.id ? me.id : DEFAULT_ID;

  const sessions = useMySearchSessions(userId);

  return (
    <View style={{ flex: 1, paddingTop: IS_ANDROID ? 40 : 0 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            // justifyContent: "center",
            alignContent: "center",
            paddingBottom: 2,
          }}
        >
          <TouchableOpacity>
            <Ionicons
              name="close"
              size={24}
              color={colors.blue}
              onPress={() => {
                closeScreen();
              }}
            />
          </TouchableOpacity>

          <BoldMonoText
            style={{ marginLeft: 5, marginTop: 5 }}
          >{`HISTORY`}</BoldMonoText>
        </View>

        <FlatList
          data={sessions || []}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginHorizontal: 18,
                paddingVertical: 12,
                borderBottomColor: "rgba(256, 256, 256, 0.5)",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                setNewSession(item.id);
                closeScreen();
              }}
            >
              <BoldMonoText>{item.firstMessage}</BoldMonoText>

              <LightText style={{ fontSize: 12, marginTop: 3 }}>
                {item.timeCreated && item.timeCreated.seconds
                  ? moment(new Date(item.timeCreated.seconds * 1000)).format(
                      "MMM Do hh:mm A"
                    )
                  : ""}
              </LightText>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
