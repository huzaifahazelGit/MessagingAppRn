import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SubmissionBackgroundSquare } from "../../components/audio/submission-background-square";
import AvatarList, {
  FetchableAvatarList,
} from "../../components/lists/avatar-list";
import { BackButton } from "../../components/buttons/buttons";
import CollaborateButton from "../../components/buttons/collaborate-button";
import FollowButton from "../../components/buttons/follow-button";
import {
  BodyText,
  BoldMonoText,
  ExtraBoldMonoText,
} from "../../components/text";
import { colors } from "../../constants/colors";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../constants/utils";
import { useWinnerChallenges } from "../../hooks/useChallenges";
import { useCosigns } from "../../hooks/useFollows";
import { useMe } from "../../hooks/useMe";
import { useProfileColors } from "../../hooks/useProfileColors";
import { userUserSubmissions } from "../../hooks/useSubmissions";
import { Cosign } from "../../models/cosign";
import { User } from "../../models/user";
import { cleanLink } from "../../services/utils";
import ProfileLinks from "./components/profile-links";
import { useMutuals } from "../../hooks/useMutuals";
import { useExecutiveArtists } from "../../hooks/useExecutiveArtists";
import ProfileImage from "../../components/images/profile-image";
import { usePlaylists } from "../../hooks/usePlaylists";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import EmptyAudioBackground from "../../components/images/empty-audio-background";

export default function ProfileMore({
  user,
  userId,
}: {
  user?: User;
  userId?: string;
}) {
  const me = useMe();
  const cosigns = useCosigns(userId);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { totalMutuals, mutualAvatars } = useMutuals(userId);

  const isMe = useMemo(() => {
    return user && me && userId && userId == me.id;
  }, [me.id, user]);

  const profileColors = useProfileColors(user, null, colors.purple);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  if (!user) {
    return (
      <View>
        <View style={{ position: "absolute", top: insets.top, left: 20 }}>
          <BackButton buttonColor="white" />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <ScrollView
        contentContainerStyle={{ paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: backgroundColor,
            paddingTop: 8,
          }}
        >
          <View style={{ paddingBottom: 12 }}>
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
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
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

                    maxWidth: SCREEN_WIDTH * 0.65,
                  }}
                >{`${user.musicianType.join(", ")}`}</BoldMonoText>
              ) : (
                <View />
              )}
              {user && user.website ? (
                <TouchableOpacity
                  style={{ marginTop: 4 }}
                  onPress={() => {
                    Linking.openURL(cleanLink(user.website, "website"));
                  }}
                >
                  <BodyText
                    style={{
                      color: buttonColor,
                      maxWidth: SCREEN_WIDTH * 0.35,
                    }}
                  >
                    {user.website}
                  </BodyText>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          </View>
        </View>
        <View
          style={{ paddingHorizontal: 20, backgroundColor: backgroundColor }}
        >
          {isMe ? (
            <View
              style={{
                flexDirection: "row",

                marginLeft: -8,
                marginBottom: 8,
              }}
            >
              <ProfileLinks user={user} />
            </View>
          ) : (
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
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
              <ProfileLinks user={user} />
            </View>
          )}

          {user.bio ? (
            <View style={{ marginVertical: 12 }}>
              <BodyText style={{ color: textColor }}>{user.bio}</BodyText>
            </View>
          ) : (
            <View />
          )}

          <View
            style={{
              borderTopColor: `${textColor}33`,
              borderTopWidth: 1,
              marginTop: 12,
              marginBottom: 80,
            }}
          >
            {user.isExecutive && <ArtistsRow user={user} />}
            {user.isExecutive && (
              <ExecutiveAudioRow user={user} kind="top-releases" />
            )}
            {user.isExecutive && (
              <ExecutiveAudioRow user={user} kind="new-drops" />
            )}

            <BioInfoRow
              title={`Performing Rights Organization`}
              value={`${user.pro}`.trim()}
              textColor={textColor}
            />
            <BioInfoRow
              textColor={textColor}
              title={`Publisher`}
              value={`${user.publisher}`.trim()}
            />
            <BioInfoRow
              textColor={textColor}
              title={`Manager`}
              value={`${user.manager}`.trim()}
            />
            {user && user.labelObj && user.labelObj.id != "custom" ? (
              <View>
                <View
                  style={{
                    paddingVertical: 12,

                    borderBottomColor: `${textColor}33`,
                    borderBottomWidth: 1,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={user.labelObj.imageURL}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 60 / 2,
                        marginRight: 12,
                      }}
                    />
                    <BoldMonoText style={{ color: textColor, fontSize: 26 }}>
                      {user.labelObj.name}
                    </BoldMonoText>
                  </View>
                </View>
              </View>
            ) : (
              <BioInfoRow
                textColor={textColor}
                title={`Label`}
                value={`${user.label}`.trim()}
              />
            )}

            <BioInfoRow
              textColor={textColor}
              title={"Location"}
              value={`${user.location}`.trim()}
            />
            <BioInfoRow
              textColor={textColor}
              title={`DAW`}
              value={`${user.daw}`.trim()}
            />
            <BioInfoRow
              textColor={textColor}
              title={"Studio Details"}
              value={`${user.studioDetails}`.trim()}
            />
            <BioInfoRow
              textColor={textColor}
              title={"Instruments"}
              value={user.instruments ? user.instruments.join(",") : ""}
            />

            {user.id != me.id && (
              <TouchableOpacity
                onPress={() => {
                  (navigation as any).navigate("FollowsScreen", {
                    userId: userId,
                    user: JSON.stringify(user),
                  });
                }}
              >
                <View
                  style={{
                    paddingVertical: 12,
                    borderBottomColor: `${textColor}33`,
                    borderBottomWidth: 1,
                    paddingBottom: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <BoldMonoText
                      style={{
                        color: textColor,
                        marginBottom: 8,
                        marginRight: 12,
                      }}
                    >
                      {`Mutuals`.toUpperCase()}
                    </BoldMonoText>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={18}
                      color="white"
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {totalMutuals > 0 && (
                      <TouchableOpacity
                        style={{
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
                            width: SCREEN_WIDTH - 160,
                            opacity: 0.5,
                          }}
                        >
                          {totalMutuals > 5 ? ` + ${totalMutuals - 5}` : ""}
                        </BodyText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate("LeaderboardScreen");
              }}
            >
              <BioInfoRow
                title={`XP Total`}
                value={`${user.xp ?? 0} XP`}
                textColor={textColor}
                includeArrow={true}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate("LeaderboardScreen", {
                  userId: user.id,
                });
              }}
            >
              <BioInfoRow
                title={`XP Rank`}
                value={`${user.rank ? `#${user.rank}` : "N/A"}`}
                textColor={textColor}
                includeArrow={true}
              />
            </TouchableOpacity>

            <BioInfoRow
              title={`Post Streak`}
              value={`${user.postStreak ?? 0} days`}
              textColor={textColor}
            />

            <BioInfoRow
              title={`Login Streak`}
              value={`${user.loginStreak ?? 0} days`}
              textColor={textColor}
            />
            {/* tara later cosigns  */}
            {/* {(cosigns || []).length > 0 ? (
              <CosignsRow cosigns={cosigns} user={user} />
            ) : (
              <View />
            )} */}

            {user && user.winCount > 0 ? <TrophiesRow user={user} /> : <View />}

            <SubmissionsRow user={user} userId={userId} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const ArtistsRow = ({ user }: { user: User }) => {
  let artists = useExecutiveArtists(user.id);
  const navigation = useNavigation();
  const me = useMe();

  const isMe = useMemo(() => {
    return user && me && user.id && user.id == me.id;
  }, [me.id, user]);

  const textColor = useMemo(() => {
    let color = user && user.textColor ? user.textColor : "#ffffff";
    if (color == "#fff") {
      return "#ffffff";
    } else {
      return color;
    }
  }, [user]);

  const buttonColor = useMemo(() => {
    let color = user && user.buttonColor ? user.buttonColor : "#ffffff";
    if (color == "#fff") {
      return "#ffffff";
    } else {
      return color;
    }
  }, [user]);

  if (!user) {
    return <View></View>;
  }

  if (artists.length == 0) {
    if (isMe) {
      return (
        <View
          style={{
            paddingVertical: 12,

            borderBottomColor: `${textColor}33`,
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <BoldMonoText
              style={{
                color: textColor,
              }}
            >
              {`Artists`.toUpperCase()}
            </BoldMonoText>

            <View
              style={{
                marginTop: 4,
                flexDirection: "row",
                width: SCREEN_WIDTH - 40,
                justifyContent: "space-between",
              }}
            >
              <BoldMonoText
                style={{
                  color: textColor,
                }}
              >
                No artists yet
              </BoldMonoText>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                  (navigation as any).navigate("ProfileAddArtistsScreen", {
                    userId: user.id,
                  });
                }}
              >
                <BoldMonoText
                  style={{
                    color: buttonColor,
                  }}
                >
                  Add Artists
                </BoldMonoText>
                <Ionicons
                  name="chevron-forward-outline"
                  size={18}
                  color={buttonColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  }

  return (
    <View
      style={{
        paddingVertical: 12,

        borderBottomColor: `${textColor}33`,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <BoldMonoText
          style={{
            color: textColor,
          }}
        >
          {`Artists`.toUpperCase()}
        </BoldMonoText>
        {isMe ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                (navigation as any).navigate("ProfileAddArtistsScreen", {
                  userId: user.id,
                });
              }}
            >
              <BoldMonoText
                style={{
                  color: buttonColor,
                }}
              >
                Add More Artists
              </BoldMonoText>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color={buttonColor}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              (navigation as any).navigate("ProfileViewArtists", {
                userId: user.id,
              });
            }}
          >
            <BoldMonoText
              style={{
                color: buttonColor,
              }}
            >
              VIEW ALL
            </BoldMonoText>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
        {[...artists].map((artist) => (
          <View
            style={{
              alignItems: "center",
              width: (SCREEN_WIDTH - 40) / 4,
              marginBottom: 12,
            }}
            key={artist.id}
          >
            <ProfileImage user={artist} size={65} border={true} />
            <BoldMonoText
              numLines={2}
              style={{
                color: textColor,
                marginTop: 3,
              }}
            >
              {artist.username}
            </BoldMonoText>
          </View>
        ))}
      </View>
    </View>
  );
};

const ExecutiveAudioRow = ({
  user,
  kind,
}: {
  user: User;
  kind: "top-releases" | "new-drops";
}) => {
  const [songs, setSongs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (user && user.id) {
      fetchTopReleasesPlaylistSongs();
    }
  }, []);

  const fetchTopReleasesPlaylistSongs = async () => {
    const coll = collection(getFirestore(), "posts");
    const qref = query(
      coll,
      where("playlistIds", "array-contains", `${user.id}-${kind}`),
      orderBy("createdate", "desc"),
      limit(20)
    );
    let items = [];
    let snap = await getDocs(qref);

    snap.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });

    setSongs(items);
    setLoaded(true);
  };

  const textColor = useMemo(() => {
    let color = user && user.textColor ? user.textColor : "#ffffff";
    if (color == "#fff") {
      return "#ffffff";
    } else {
      return color;
    }
  }, [user]);

  if (!user) {
    return <View></View>;
  }

  if (songs.length == 0) {
    return <View />;
  }

  let width = 180;

  return (
    <View
      style={{
        paddingVertical: 12,

        borderBottomColor: `${textColor}33`,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <BoldMonoText
          style={{
            color: textColor,
            fontSize: kind == "top-releases" ? 24 : 14,
          }}
        >
          {kind == "top-releases"
            ? `TOP RELEASES`.toUpperCase()
            : `NEW DROPS`.toUpperCase()}
        </BoldMonoText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
          {[...songs].map((song) => (
            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate("PostDetail", {
                  postId: song.id,
                });
              }}
              key={song.id}
              style={{ marginRight: 8 }}
            >
              {song.image ? (
                <Image
                  source={{ uri: song.image }}
                  style={{ width: width, height: width, borderRadius: 4 }}
                  contentFit="cover"
                />
              ) : (
                <EmptyAudioBackground size={width} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const TrophiesRow = ({ user }: { user: User }) => {
  const navigation = useNavigation();
  const wonChallenges = useWinnerChallenges(user.id);
  const textColor = useMemo(() => {
    let color = user && user.textColor ? user.textColor : "#ffffff";
    if (color == "#fff") {
      return "#ffffff";
    } else {
      return color;
    }
  }, [user]);

  if (!user) {
    return <View></View>;
  }
  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomColor: `${textColor}33`,
        borderBottomWidth: 1,
        paddingBottom: 20,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <BoldMonoText
          style={{
            color: textColor,

            marginRight: 12,
          }}
        >
          {`Trophies`.toUpperCase()}
        </BoldMonoText>

        <FontAwesome name="trophy" size={20} color="white" />
        <ExtraBoldMonoText style={{ fontSize: 16, marginLeft: 4 }}>
          {user.winCount}
        </ExtraBoldMonoText>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          {wonChallenges.map((challenge) => (
            <TouchableOpacity
              onPress={() => {
                (navigation as any).navigate("ArenaDetails", {
                  screen: "ArenaDetailScreen",
                  params: {
                    challengeId: challenge.id,
                  },
                });
              }}
              style={{
                width: SCREEN_WIDTH / 2,
                marginRight: 10,
              }}
              key={challenge.id}
            >
              <Image
                style={{
                  width: SCREEN_WIDTH / 2,
                  height: SCREEN_WIDTH / 2,
                }}
                source={{ uri: challenge.coverImage }}
              />
              <BodyText numLines={2} style={{ marginTop: 8 }}>
                {challenge.title}
              </BodyText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const SubmissionsRow = ({ user, userId }: { user: User; userId: string }) => {
  const navigation = useNavigation();

  const submissions = userUserSubmissions(userId);

  const textColor = useMemo(() => {
    let color = user && user.textColor ? user.textColor : "#ffffff";
    if (color == "#fff") {
      return "#ffffff";
    } else {
      return color;
    }
  }, [user]);

  if (!user) {
    return <View></View>;
  }

  if (submissions.length == 0) {
    return <View></View>;
  }

  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomColor: `${textColor}33`,
        borderBottomWidth: 1,
        paddingBottom: 20,
      }}
    >
      <BoldMonoText
        style={{
          color: textColor,
          marginBottom: 20,
        }}
      >
        {`Submissions`.toUpperCase()}
      </BoldMonoText>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          {submissions.map((submission) => (
            <TouchableOpacity
              key={submission.id}
              onPress={() => {
                (navigation as any).navigate("ArenaDetails", {
                  screen: "ArenaDetailScreen",
                  params: {
                    challengeId: submission.challengeId,
                  },
                });
              }}
              style={{
                width: (SCREEN_WIDTH - 30) / 2,
                marginRight: 10,
              }}
            >
              <SubmissionBackgroundSquare
                submission={submission}
                skipFakeBackground={false}
              />
              <BodyText numLines={2} style={{ marginTop: 8, color: textColor }}>
                {submission.uploadTitle}
              </BodyText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const CosignsRow = ({ cosigns, user }: { cosigns: Cosign[]; user: User }) => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  const profileColors = useProfileColors(user);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  if (!user) {
    return <View></View>;
  }

  return (
    <View
      style={{
        paddingVertical: 12,

        borderBottomColor: `${textColor}33`,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FetchableAvatarList
          userIds={cosigns.map((item) => item.fromUserIds[0])}
          size={38}
          users={users}
          setUsers={setUsers}
        />
        <BoldMonoText
          style={{
            color: textColor,
            marginBottom: 2,
            marginLeft: 5,
          }}
        >
          {`${
            cosigns.length > 3 ? `+ ${cosigns.length - 3}` : `${cosigns.length}`
          } Endorsement${cosigns.length == 1 ? "" : "s"}`.toUpperCase()}
        </BoldMonoText>
      </View>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: textColor,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
          onPress={() => {
            (navigation as any).navigate("CosignsScreen", {
              user: JSON.stringify(user),
              userId: user.id,
            });
          }}
        >
          <BoldMonoText style={{ color: backgroundColor }}>
            ENDORSE
          </BoldMonoText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BioInfoRow = ({
  title,
  value,
  textColor,
  includeArrow,
}: {
  title: string;
  value: string;
  textColor: string;
  includeArrow?: boolean;
}) => {
  if (value && value != "none") {
    return (
      <View
        style={{
          paddingVertical: 12,

          borderBottomColor: `${textColor}33`,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <BoldMonoText
            style={{
              color: textColor,
              marginBottom: 2,
            }}
          >
            {`${title}`.toUpperCase()}
          </BoldMonoText>
          <BoldMonoText style={{ color: textColor, fontSize: 26 }}>
            {value}
          </BoldMonoText>
        </View>
        {includeArrow && (
          <Ionicons name="chevron-forward-outline" size={18} color="white" />
        )}
      </View>
    );
  }

  return <View />;
};
