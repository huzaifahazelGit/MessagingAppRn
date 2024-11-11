import {
  FontAwesome,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  getFirestore,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { DEFAULT_ID } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { ProfileColors } from "../../hooks/useProfileColors";
import { Post } from "../../models/post";
import { AddToJukeboxModal } from "../modals/add-to-jukebox-modal";

export default function AddToJukeboxButton({
  post,
  profileColors,
}: {
  post: Post;
  profileColors: ProfileColors;
}) {
  const { textColor, buttonColor } = profileColors;
  const me = useMe();
  const [showAddToJukebox, setShowAddToJukebox] = useState(false);
  const postId = post.id || DEFAULT_ID;

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          setShowAddToJukebox(true);
        }}
      >
        <AntDesign name="pluscircleo" size={22} color={textColor} />
      </TouchableOpacity>

      <AddToJukeboxModal
        post={post}
        showModal={showAddToJukebox}
        setShowModal={setShowAddToJukebox}
        onSaveToJukebox={(res) => {}}
      />
    </View>
  );
}
