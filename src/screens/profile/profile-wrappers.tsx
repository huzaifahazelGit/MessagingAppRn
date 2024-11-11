import { useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { doc, getFirestore } from "firebase/firestore";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { useFirestoreDocData } from "reactfire";
import { colors } from "../../constants/colors";
import { DEFAULT_ID } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { useOrientation } from "../../hooks/useOrientation";
import { HorizontalJukebox } from "../jukebox-horizontal.tsx/horizontal-jukebox";
import Profile from "./profile";
import RAIButton from "../../components/rai/rai-button";

export function MyProfileScreen() {
  const me = useMe();

  const orientation = useOrientation();

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  useEffect(() => {
    unlockOrientation();
  }, []);

  if (orientation != ScreenOrientation.Orientation.PORTRAIT_UP) {
    return (
      <HorizontalJukebox user={me} userId={me && me.id ? me.id : DEFAULT_ID} />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <Profile
        user={me}
        includeBack={false}
        userId={me && me.id ? me.id : DEFAULT_ID}
      />

      <View style={{ position: "absolute", right: 0, bottom: 0 }}>
        <RAIButton stack="my-profile" />
      </View>
    </View>
  );
}

export function OtherProfileScreen() {
  const route = useRoute();
  let params = route.params as any;
  let userId = params.userId;
  const me = useMe();
  const ref = doc(getFirestore(), "users", userId);

  const { data: user } = useFirestoreDocData(ref);

  const orientation = useOrientation();

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  useEffect(() => {
    unlockOrientation();
  }, []);

  const isMe = useMemo(() => {
    return me && me.id == userId;
  }, [me, userId]);

  if (orientation != ScreenOrientation.Orientation.PORTRAIT_UP) {
    return <HorizontalJukebox user={user} userId={userId} />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <Profile
        user={user ? { ...(user as any), id: userId } : null}
        includeBack={true}
        userId={userId}
      />

      <View style={{ position: "absolute", right: 0, bottom: 0 }}>
        <RAIButton stack={isMe ? "my-profile" : "other-profile"} />
      </View>
    </View>
  );
}
