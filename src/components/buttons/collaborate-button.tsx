import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { Fonts } from "../../constants/fonts";
import { DEFAULT_ID } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { Collaboration } from "../../models/collaboration";
import { MarketplaceItem } from "../../models/marketplace";
import {
  SocialStore,
  addCollabToStore,
  addNotConnectedToStore,
} from "../../store/follows-collabs-store";
import { OutlineButton, PressableOutlineButton } from "./buttons";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default function CollaborateButton({
  userId,
  color,
  style,
  marketplaceItem,
  wide,
}: {
  userId: string;
  color: string;
  style?: any;
  marketplaceItem?: MarketplaceItem;
  wide?: boolean;
}) {
  const me = useMe();
  const [collab, setCollab] = useState<Collaboration>(null);
  const [loaded, setLoaded] = useState(true);

  const navigation = useNavigation();
  const collabs = SocialStore.useState((s) => s.collabs);
  const notConnected = SocialStore.useState((s) => s.notConnected);

  useEffect(() => {
    loadCollaborations();
  }, [userId]);

  const loadCollaborations = async () => {
    if (me && me.id && userId && userId != DEFAULT_ID && !collab) {
      let existingCollab = collabs.find((item) =>
        item.userIds.includes(userId)
      );
      let existingNotCollab = notConnected.find((item) => item == userId);
      if (existingCollab) {
        setCollab(existingCollab);
      } else if (!existingNotCollab) {
        setLoaded(false);
        let items = [];

        const q = query(
          collection(getFirestore(), "collaborations"),
          where("userIds", "==", [me.id, userId])
        );

        const snapshotOne = await getDocs(q);

        const qTwo = query(
          collection(getFirestore(), "collaborations"),
          where("userIds", "==", [userId, me.id])
        );

        let snapshotTwo = await getDocs(qTwo);
        snapshotOne.forEach((child) => {
          items.push({ ...child.data(), id: child.id });
        });
        snapshotTwo.forEach((child) => {
          items.push({ ...child.data(), id: child.id });
        });
        if (items.length > 0) {
          let collab = items[0];
          setCollab(collab);
          addCollabToStore(collab, me.id);
        } else {
          addNotConnectedToStore(userId);
        }
        setLoaded(true);
      }
    }
  };

  const createChat = async () => {
    if (me && me.id) {
      if (collab) { 
        console.log("--run1CreateChat---",marketplaceItem,collab.marketplace,collab);

        if (!marketplaceItem && collab.marketplace) {
          const ref = doc(getFirestore(), "collaborations", collab.id);
          await updateDoc(ref, {
            marketplace: false,
            marketplaceId: null,
          });
        }
        (navigation as any).navigate("Inbox", {
          screen: "ChatDetailScreen",
          params: {
            collaborationId: collab.id,
            collaboration: JSON.stringify(collab),
            marketplaceItem: JSON.stringify(marketplaceItem),
          },
        });
      } else {
        console.log("--run2---");
        
        let collab: Collaboration = {
          userIds: [me.id, userId],
          initiatorId: me.id,
          initiatorName: me.username,
          accepted: false,
          completed: false,
          createdate: new Date(),
          lastupdate: new Date(),
          archived: false,
          subheading: "",
          onProfileIds: [],
          marketplace: marketplaceItem != null,
          marketplaceId: marketplaceItem ? marketplaceItem.id : null,
          lastRecipientId: userId,
          unreadCount: 1,
        };
        (navigation as any).navigate("Inbox", {
          screen: "ChatDetailScreen",
          params: {
            collaborationId: "new",
            collaboration: JSON.stringify(collab),
            marketplaceItem: marketplaceItem
              ? JSON.stringify(marketplaceItem)
              : null,
          },
        });
      }
    } else {
      Alert.alert("Please sign in to collaborate.", "", [
        {
          text: "OK",
          onPress: () => (navigation as any).navigate("Login"),
        },
      ]);
    }
  };

  return (me && me.id && me.id == userId) || userId == DEFAULT_ID ? (
    <View />
  ) : wide ? (
    <OutlineButton
      style={{ borderColor: color, flex: 1 }}
      textStyle={{
        color: color,
        fontFamily: Fonts.MonoBold,
        paddingHorizontal: 0,
        
      }}
      submit={createChat}
      title={"Message"}
      loading={!loaded}
    />
  ) : (
    <Pressable
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        opacity: loaded ? 1 : 0.5,
        ...style,
      }}
      disabled={!loaded}
      onPress={createChat}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            borderColor: color,
            borderWidth: 2,
            borderRadius: 20 / 2,
            width: 20,
            height: 20,
          }}
        />
        <View
          style={{
            borderColor: color,
            borderWidth: 2,
            borderRadius: 20 / 2,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -6,
          }}
        />
      </View>
    </Pressable>
  );
}
