import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Pressable, TouchableOpacity, View } from "react-native";
import CollaborateButton from "../../../components/buttons/collaborate-button";
import FollowButton from "../../../components/buttons/follow-button";
import AvatarList from "../../../components/lists/avatar-list";
import { BodyText, BoldMonoText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useMe } from "../../../hooks/useMe";
import { useMutuals } from "../../../hooks/useMutuals";
import { useUserSessions } from "../../../hooks/useSessions";
import { User } from "../../../models/user";
import { cleanLink } from "../../../services/utils";
import XPView from "./xp-view";

export default function UserHeader({
  user,
  userId,
}: {
  user?: User;
  userId: string;
}) {
  const navigation = useNavigation();
  const me = useMe();

  const { totalMutuals, mutualAvatars } = useMutuals(userId);
  const [companies, setCompanies] = useState([]);

  const sessions = useUserSessions(userId);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    let promises = [];

    (user.companyIds || []).forEach((companyId) => {
      const docRef = doc(getFirestore(), "companies", companyId);
      promises.push(
        getDoc(docRef).then((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    const results = await Promise.all(promises);

    setCompanies(results);
  };

  const isMe = useMemo(() => {
    return user && me && user.id == me.id;
  }, [me.id, user]);

  const textColor = useMemo(() => {
    return user.textColor ?? colors.white;
  }, [user]);

  const buttonColor = useMemo(() => {
    return user.buttonColor ?? colors.blue;
  }, [user]);

  if (!user) {
    return <View />;
  }

  return (
    <View
      style={{
        paddingBottom: 10,
      }}
    >
      <View style={{ marginTop: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ maxWidth: SCREEN_WIDTH - 140 - 40 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BoldMonoText
                style={
                  user.isExecutive
                    ? {
                        shadowColor: textColor,
                        shadowOffset: {
                          width: 1,
                          height: 4,
                        },
                        shadowOpacity: 0.8,
                        shadowRadius: 3,

                        elevation: 5,
                        color: textColor,
                        fontSize: 22,
                      }
                    : {
                        color: textColor,
                        fontSize: 22,
                      }
                }
              >
                {`${user.username}`.toUpperCase()}
              </BoldMonoText>

              {user.winCount > 0 && (
                <TouchableOpacity
                  style={{ marginLeft: 12, flexDirection: "row" }}
                  onPress={() => {
                    (navigation as any).navigate("ArenaDetails", {
                      screen: "LeaderboardDetailScreen",
                      params: {
                        userId: userId,
                      },
                    });
                  }}
                >
                  <FontAwesome name="trophy" size={26} color="white" />
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 25,
                      paddingTop: 2,
                    }}
                  >
                    <BoldMonoText
                      style={{
                        color: "black",
                      }}
                    >
                      {user.winCount}
                    </BoldMonoText>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {user.isExecutive ? (
              <BoldMonoText
                style={{
                  marginTop: 4,
                  color: textColor,

                  maxWidth: SCREEN_WIDTH * 0.65,
                }}
              >{`Executive User`}</BoldMonoText>
            ) : user.musicianType ? (
              <BoldMonoText
                style={{
                  marginTop: 4,
                  color: textColor,
                  maxWidth: SCREEN_WIDTH - 80,
                  fontSize: 12,
                }}
              >{`${user.musicianType.join(", ")}`}</BoldMonoText>
            ) : (
              <View />
            )}

            {(companies || []).length > 0 ? (
              <View style={{ marginTop: 4 }}>
                {companies.map((company) => (
                  <TouchableOpacity
                    onPress={() => {
                      (navigation as any).navigate("CompanyStack", {
                        screen: "CompanyProfileScreen",
                        params: { companyId: company.id },
                      });
                    }}
                    key={company.id}
                  >
                    <BoldMonoText style={{ color: buttonColor, fontSize: 13 }}>
                      {company.name}
                    </BoldMonoText>
                  </TouchableOpacity>
                ))}
              </View>
            ) : user.label && user.label != "none" ? (
              <View style={{ marginTop: 4 }}>
                <BoldMonoText style={{ color: textColor, fontSize: 13 }}>
                  {user.label}
                </BoldMonoText>
              </View>
            ) : (
              <View />
            )}

            {totalMutuals > 0 && user.id != me.id && (
              <TouchableOpacity
                style={{
                  marginTop: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() =>
                  (navigation as any).navigate("FollowsScreen", {
                    userId: userId,
                    user: JSON.stringify(user),
                  })
                }
              >
                <AvatarList
                  avatars={mutualAvatars}
                  totalCount={mutualAvatars.length}
                />
                <BodyText
                  style={{
                    color: textColor,
                    // marginLeft: 8,
                    width: SCREEN_WIDTH - 160,
                    opacity: 0.5,
                  }}
                >
                  {/* {`followed by ${mutualNames.join(", ")}${
                    totalMutuals > 3 ? ` and ${totalMutuals - 3} others` : ""
                  }`} */}
                  {totalMutuals > 5 ? ` + ${totalMutuals - 5}` : ""}
                </BodyText>
              </TouchableOpacity>
            )}

            {user && user.website ? (
              <Pressable
                style={{ marginTop: 4 }}
                onPress={() => {
                  Linking.openURL(cleanLink(user.website, "website"));
                }}
              >
                <BodyText
                  style={{
                    color: buttonColor,
                  }}
                >
                  {user.website}
                </BodyText>
              </Pressable>
            ) : (
              <View />
            )}
          </View>
          <View
            style={{
              width: 140,
              alignItems: "flex-end",
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate("LeaderboardScreen");
              }}
            >
              <XPView user={user} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
      >
        {isMe ? (
          <View style={{ flexDirection: "row" }}></View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <FollowButton
              user={user}
              color={textColor}
              userId={userId}
              wide={true}
            />
            <View style={{ width: 8 }} />
            <CollaborateButton
              wide={true}
              userId={userId}
              color={textColor}
              marketplaceItem={null}
            />
          </View>
        )}
      </View>
    </View>
  );
}
