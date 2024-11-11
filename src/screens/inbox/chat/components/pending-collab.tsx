import { useNavigation } from "@react-navigation/native";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { View } from "react-native";
import { OutlineButton } from "../../../../components/buttons/buttons";
import ProfileImage from "../../../../components/images/profile-image";
import { BoldText } from "../../../../components/text";
import { colors } from "../../../../constants/colors";
import { useMe } from "../../../../hooks/useMe";

export default function PendingCollab({
  otherUser,
  collaboration,
  setCollaboration,
}) {
  const [declineLoading, setDeclineLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const me = useMe();

  const navigation = useNavigation();

  const acceptCollab = async () => {
    setAcceptLoading(true);
    await updateDoc(doc(getFirestore(), "collaborations", collaboration.id), {
      lastupdate: new Date(),
      archived: false,
      accepted: true,
    });

    setCollaboration({
      ...collaboration,
      lastupdate: new Date(),
      archived: false,
      accepted: true,
    });
    setAcceptLoading(false);
  };

  const denyCollab = async () => {
    setDeclineLoading(true);
    await updateDoc(doc(getFirestore(), "collaborations", collaboration.id), {
      lastupdate: new Date(),
      subheading: "Collaboration declined.",
      archived: true,
    });

    setDeclineLoading(false);
    navigation.goBack();
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 30,
      }}
    >
      <ProfileImage user={otherUser} size={80} />
      <BoldText
        style={{
          marginVertical: 15,
          textAlign: "center",
          paddingHorizontal: 20,
        }}
      >
        {collaboration.initiatorId == me.id
          ? `Waiting on ${`${
              otherUser ? otherUser.username : ""
            }`.trim()}'s response...`
          : `${
              otherUser
                ? `${otherUser ? otherUser.username : ""}`.trim()
                : "This user"
            } wants to start a collaboration with you.`}
      </BoldText>

      {collaboration.initiatorId == me.id ? (
        <View></View>
      ) : (
        <View style={{ flexDirection: "row", marginTop: 18 }}>
          <OutlineButton
            submit={denyCollab}
            title={"Decline"}
            loading={declineLoading}
          />

          <OutlineButton
            style={{
              marginLeft: 10,
              backgroundColor: colors.white,
              paddingHorizontal: 20,
            }}
            textStyle={{ color: "black" }}
            submit={acceptCollab}
            title={"Accept"}
            loading={acceptLoading}
          />
        </View>
      )}
    </View>
  );
}
