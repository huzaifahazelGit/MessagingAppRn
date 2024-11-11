import { useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { useFirestoreDocData } from "reactfire";
import { CloseButton } from "../../components/buttons/buttons";
import ProfileImage from "../../components/images/profile-image";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_WIDTH } from "../../constants/utils";

export function ProfileViewArtists() {
  const route = useRoute();
  let params = route.params as any;
  let userId = params.userId;
  const [members, setMembers] = useState([]);
  const ref = doc(getFirestore(), "users", userId);

  const { data: user } = useFirestoreDocData(ref);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    let items = [];

    const q = query(
      collection(getFirestore(), "users"),
      where("executiveIds", "array-contains", userId)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((child) => {
      items.push({ ...child.data(), id: child.id });
    });
    setMembers(items);
  };

  if (!user) {
    return <View></View>;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightblack,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <BoldMonoText style={{ fontSize: 24 }}>
          {`All Artists`.toUpperCase()}
        </BoldMonoText>
        <CloseButton />
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <ScrollView>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}
          >
            {[...members].map((artist) => (
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
                    marginTop: 3,
                  }}
                >
                  {artist.username}
                </BoldMonoText>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
