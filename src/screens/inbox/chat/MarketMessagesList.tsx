import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { BodyText, BoldMonoText, LightText } from "../../../components/text";
import { DEFAULT_ID } from "../../../constants/utils";
import { useMyCollaborations } from "../../../hooks/useCollaborations";
import { useMe } from "../../../hooks/useMe";
import ChatItem from "./components/chat-item";
import { useMyRooms } from "../../../hooks/useRooms";
import RoomsList from "../rooms/rooms-list";
import { TouchableOpacity } from "react-native";

export default function MarketMessagesList() {
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const collabs = useMyCollaborations(userId);
  console.log("==collabsMarketMessagesList=",collabs);


  const [selectedTab, setSelectedTab] = useState<
    "rooms" | "messages" | "submissions"
  >("messages");

  // const chatData = useMemo(() => {
  //   let raiChat = (collabs || []).find((c) => c.userIds.includes("RAI"));
  //   let chats = (collabs || []).filter((c) => !c.userIds.includes("RAI"));
  //   chats.sort(function (a, b) {
  //     return b.lastupdate.seconds - a.lastupdate.seconds;
  //   });

  //   if (raiChat) {
  //     return [...chats, raiChat];
  //   }
  //   return chats;
  // }, [collabs]);

  const chatData = useMemo(() => {
    // Filter collabs to only include those where marketplace === true
    const restrictedCollabs = (collabs || []).filter((c) => c.marketplace === true);
  
    // Find the RAI chat
    let raiChat = restrictedCollabs.find((c) => c.userIds.includes("RAI"));
  
    // Get the chats that do not include RAI
    let chats = restrictedCollabs.filter((c) => !c.userIds.includes("RAI"));
  
    // Sort the chats by last update
    chats.sort((a, b) => b.lastupdate.seconds - a.lastupdate.seconds);
  
    // If there is a RAI chat, add it to the end of the chats array
    if (raiChat) {
      return [...chats, raiChat];
    }
    
    // Return the sorted chats
    return chats;
  }, [collabs]);
  useEffect(() => {
    moment.updateLocale("en", {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "1m",
        m: "%dm",
        mm: "%dm",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd",
        M: "%d month",
        MM: "%d months",
        y: "%dy",
        yy: "%dy",
      },
    });
  }, []);

  if (selectedTab == "rooms") {
    return (
      <View style={{ flex: 1 }}>
        <TabSelector
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <RoomsList />
      </View>
    );
  }

  if (selectedTab == "submissions") {
    return (
      <View style={{ flex: 1 }}>
        <TabSelector
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 20,
          }}
        >
          <BoldMonoText>COMING SOON.</BoldMonoText>
        </View>
      </View>
    );
  }

  console.log("--chatData-",chatData);
  

  return (
    <View style={{ flex: 1 }}>
      {/* <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} /> */}
      <FlatList
        data={chatData as any[]}
        contentContainerStyle={{
          paddingBottom: 60,
          paddingHorizontal: 10,
        }}
        renderItem={({ item }) => <ChatItem collaboration={item} />}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 20,
              borderTopColor: "rgba(255,255,255,0.3)",
              borderTopWidth: 1,
            }}
          >
            <LightText>No messages.</LightText>
          </View>
        }
      />
    </View>
  );
}

const TabSelector = ({ selectedTab, setSelectedTab }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 12,
        paddingHorizontal: 20,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            marginRight: 5,
            borderColor: "white",
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 6,
            backgroundColor:
              selectedTab == "messages" ? "white" : "transparent",
          }}
          onPress={() => setSelectedTab("messages")}
        >
          <BoldMonoText
            style={{
              color: selectedTab == "messages" ? "black" : "white",
            }}
          >
            General
          </BoldMonoText>
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            marginRight: 5,
            marginLeft: 5,
            borderColor: "white",
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 6,
            backgroundColor: selectedTab == "rooms" ? "white" : "transparent",
          }}
          onPress={() => setSelectedTab("rooms")}
        >
          <BoldMonoText
            style={{
              color: selectedTab == "rooms" ? "black" : "white",
            }}
          >
            Rooms
          </BoldMonoText>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            marginLeft: 5,
            borderColor: "white",
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 6,
            backgroundColor:
              selectedTab == "submissions" ? "white" : "transparent",
          }}
          onPress={() => setSelectedTab("submissions")}
        >
          <BoldMonoText
            style={{
              color: selectedTab == "submissions" ? "black" : "white",
            }}
          >
            Submissions
          </BoldMonoText>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};
