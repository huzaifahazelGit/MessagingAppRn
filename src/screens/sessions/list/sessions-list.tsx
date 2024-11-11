import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import ProfileImage from "../../../components/images/profile-image";
import { BodyText } from "../../../components/text";
import { useMe } from "../../../hooks/useMe";
import { useSessions } from "../../../hooks/useSessions";
import { StoryPreviewWrapper } from "./story-preview-item";
import { SocialStore } from "../../../store/follows-collabs-store";
import { DEFAULT_ID } from "../../../constants/utils";

export default function SessionsList({
  kind,
}: {
  kind: "EXPLORE" | "BOOKMARKS" | "FOLLOWING" | "MARKETPLACE";
}) {
  const watched = SocialStore.useState((s) => s.seenSessions);
  const me = useMe();
  const navigation = useNavigation();
  const userId = me ? me.id : DEFAULT_ID;

  const sessions = useSessions(kind, me.id);

  const sortedList = useMemo(() => {
    let userIdList = [];
    let userMap = {};
    (sessions || []).forEach((session) => {
      if (Object.keys(userMap).indexOf(session.userId) === -1) {
        userMap[session.userId] = [];
      }
      userMap[session.userId].push(session);
      if (userIdList.indexOf(session.userId) === -1) {
        userIdList.push(session.userId);
      }
    });

    let list = userIdList.map((userId) => {
      let seen = 1;
      userMap[userId].forEach((session) => {
        if (
          (session.seenIds || []).indexOf(me.id) > -1 ||
          watched.indexOf(session.id) > -1
        ) {
          // seen
        } else {
          seen = 0;
        }
      });
      return { userId: userId, stories: userMap[userId], seen: seen };
    });

    list.sort((a, b) => {
      return a.seen - b.seen;
    });

    return list;
  }, [sessions, userId, watched]);

  const onSelectStory = (storyList, user, superImages, index) => {
    let upcoming = [...sortedList]
      .splice(index + 1, sortedList.length - index)
      .map((item) => item.stories);

    (navigation as any).navigate("Sessions", {
      screen: "SessionView",
      params: {
        stories: JSON.stringify(storyList),
        otherUser: JSON.stringify(user),
        groupIndex: index,
        upcomingSessions: JSON.stringify(upcoming),
      },
    });
  };

  if (kind === "MARKETPLACE" || kind == "BOOKMARKS") {
    return <View />;
  }

  return (
    <View
      style={{
        position: "relative",
        paddingVertical: 10,
        height: 104,
      }}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={{ paddingHorizontal: 14 }}
      >
        <StoryAdderItem />

        {sortedList.map((item, index) => (
          <StoryPreviewWrapper
            stories={item.stories}
            key={index}
            index={index}
            userId={item.userId}
            onSelectStory={onSelectStory}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const StoryAdderItem = () => {
  const me = useMe();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate("Sessions", { screen: "SessionCreate" });
      }}
      activeOpacity={0.8}
      style={{ marginHorizontal: 10, position: "relative" }}
    >
      <ProfileImage size={64} user={me} />
      <View
        style={{
          position: "absolute",
          bottom: 17.5,
          right: -2.5,
          width: 20,
          height: 20,
          borderWidth: 2,
          borderColor: "#fff",
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#318bfb",
        }}
      >
        <MaterialIcons name="add" size={16} color="white" />
      </View>
      <View
        style={{
          maxWidth: 64,
          height: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BodyText>Your Story</BodyText>
      </View>
    </TouchableOpacity>
  );
};
