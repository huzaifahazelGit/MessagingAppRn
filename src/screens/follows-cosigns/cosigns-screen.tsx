import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import Popover from "react-native-popover-view";
import Share from "react-native-share";
import NavBar from "../../components/navbar";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../constants/utils";
import { useCosigns } from "../../hooks/useFollows";
import { useMe } from "../../hooks/useMe";
import { useProfileColors } from "../../hooks/useProfileColors";
import { bodyTextForKind } from "../../services/activity-service";
import { createInviteLink } from "../../services/link-service";
import { CosignItem } from "./cosigns/cosign-item";

export default function CosignsScreen() {
  const me = useMe();
  const [toUser, setToUser] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  let params = route.params as any;
  let userId = params.userId;
  const [prevRequest, setPrevRequest] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const cosigns = useCosigns(userId);

  useEffect(() => {
    setToUser(JSON.parse(params.user));
    loadRequests();
  }, []);

  const loadRequests = async () => {
    let items = [];

    let q = query(
      collection(getFirestore(), "activity"),
      where("kind", "==", "cosign-request"),
      where("actorId", "==", me.id ? me.id : DEFAULT_ID),
      where("recipientId", "==", userId ? userId : DEFAULT_ID)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((child) => {
      items.push({ ...child.data(), id: child.id });
    });
    if (items.length > 0) {
      let request = items[0];
      setPrevRequest(request);
    }
    setLoaded(true);
  };

  const profileColors = useProfileColors(toUser, null, colors.white);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  const requestCosign = async () => {
    if (prevRequest || !loaded) {
      return;
    }
    Alert.alert(
      "Request Cosign",
      `Do you want to send a cosign request to ${toUser.username}?`,
      [
        {
          text: "Yes",
          onPress: async () => {
            var createActivity = httpsCallable(
              getFunctions(),
              "createActivity"
            );
            let activityKind = "cosign-request";
            createActivity({
              actor: {
                id: me.id,
                username: me.username,
                profilePicture: me.profilePicture,
              },
              recipientId: toUser.id,
              kind: activityKind,
              post: null,
              bodyText: bodyTextForKind(activityKind, me),
              extraVars: {},
            })
              .then((result) => {
                if (result && result.data) {
                  setPrevRequest((result.data as any).activity);
                }
              })
              .catch((err) => {
                console.log("error", err);
              });
          },
        },
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
  };

  const openInvite = async () => {
    let link = createInviteLink(me.id);

    try {
      await Share.open({ url: link, message: "Join me on Realm" });
    } catch (error) {
      console.log("error 8");
      console.log(error);
    }
  };

  if (!toUser) {
    return <View></View>;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <NavBar
        title={"Endorsements"}
        skipTitle={false}
        includeBack={true}
        buttonColor={buttonColor}
        textColor={textColor}
        rightIcon={
          <Popover
            isVisible={showPopover}
            onRequestClose={() => setShowPopover(false)}
            popoverStyle={{ backgroundColor: "white" }}
            from={
              <TouchableOpacity
                onPress={() => setShowPopover(true)}
                style={{ height: 25 }}
              >
                <Feather
                  name="more-horizontal"
                  size={24}
                  color={buttonColor}
                  // style={{ opacity: 0.5 }}
                />
              </TouchableOpacity>
            }
          >
            <View
              style={{
                // backgroundColor: backgroundColor,
                borderColor: buttonColor,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  width: 180,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 12,
                }}
                onPress={requestCosign}
              >
                <BodyText style={{ color: "black" }}>
                  Request an endorsement from {toUser.username}
                </BodyText>
              </TouchableOpacity>
            </View>
          </Popover>
        }
      />

      <View style={{ flex: 1 }}>
        <FlatList
          data={cosigns || []}
          contentContainerStyle={{
            borderTopColor: `${textColor}33`,
            borderTopWidth: 1,
            paddingBottom: 60,
            marginHorizontal: 20,
            marginTop: 20,
          }}
          ListFooterComponent={
            me && me.id == userId ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                {/* <BodyText style={{ textAlign: "center", color: textColor }}>
                  {`Want to add an endorsement from someone\n who isn't on Realm?`}
                </BodyText> */}
                <TouchableOpacity
                  onPress={() => {
                    openInvite();
                  }}
                  style={{
                    borderBottomColor: textColor,
                    borderBottomWidth: 1,
                    paddingTop: 4,
                  }}
                >
                  <BodyText style={{ color: textColor }}>
                    Send an invite.
                  </BodyText>
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )
          }
          ListEmptyComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 100,
              }}
            >
              <BodyText
                style={{ color: textColor }}
              >{`${toUser.username} has not been endorsed yet.`}</BodyText>
            </View>
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CosignItem cosign={item} toUser={toUser} />
          )}
        />
        {me && me.id && userId == me.id ? (
          <View />
        ) : (
          <View
            style={{
              width: SCREEN_WIDTH - 30,
              marginLeft: 15,
              height: 60,
              paddingVertical: 10,
              borderColor: buttonColor,
              borderWidth: 2,
              borderRadius: 15,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
              onPress={() => {
                (navigation as any).navigate("CosignFormScreen", {
                  user: JSON.stringify(toUser),
                  userId: toUser.id,
                });
              }}
            >
              <BoldMonoText
                style={{
                  textAlign: "center",
                  marginTop: -6,
                  color: buttonColor,
                }}
              >
                {`Endorse ${toUser ? toUser.username : ""}`}
              </BoldMonoText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
