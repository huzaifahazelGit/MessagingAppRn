import { useNavigation, useRoute } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useFirestoreDocData } from "reactfire";
import { UserPickerInnerModal } from "../../components/upload-wrappers/userpicker-button";
import { colors } from "../../constants/colors";
import { DEFAULT_ID } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { bodyTextForKind } from "../../services/activity-service";

export function ProfileAddArtistsScreen() {
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [originalMembers, setOriginalMembers] = useState([]);

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
    setOriginalMembers(items);
  };

  const notifyMemberAdded = async (user) => {
    var createActivity = httpsCallable(getFunctions(), "createActivity");
    let activityKind = "executive-add-artist";
    createActivity({
      actor: {
        id: me.id,
        username: me.username,
        profilePicture: me.profilePicture,
      },
      recipientId: user.id,
      kind: activityKind,

      bodyText: bodyTextForKind(activityKind, me),
      extraVars: {},
    });
  };

  const onConfirm = () => {
    let originalUserIds = originalMembers.map((item) => item.id);

    let newUsers = members.filter((user) => !originalUserIds.includes(user.id));
    let deletedUserIds = originalUserIds.filter(
      (id) => !members.map((item) => item.id).includes(id)
    );

    newUsers.forEach((user) => {
      let docRef = doc(getFirestore(), "users", user.id);
      updateDoc(docRef, {
        executiveIds: arrayUnion(userId),
      });
      notifyMemberAdded(user);
    });

    deletedUserIds.forEach((id) => {
      let docRef = doc(getFirestore(), "users", id);
      updateDoc(docRef, {
        executiveIds: arrayUnion(userId),
      });
    });

    navigation.goBack();
  };

  if (!user) {
    return <View />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: 20,
      }}
    >
      <UserPickerInnerModal
        title={"Add Artists".toUpperCase()}
        setShowModal={() => {
          navigation.goBack();
        }}
        confirm={(emptyval) => {
          onConfirm();
        }}
        users={members}
        setUsers={(newM) => {
          setMembers(newM);
        }}
      />
    </View>
  );
}
