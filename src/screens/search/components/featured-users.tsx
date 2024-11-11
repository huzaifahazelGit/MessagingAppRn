import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

import ProfileImage from "../../../components/images/profile-image";
import { BodyText } from "../../../components/text";
import { useFeaturedUsers } from "../../../hooks/useUsers";
import { shuffle } from "../../../services/utils";

export default function FeaturedUsers({ shuffledUsers }) {
  const navigation = useNavigation();

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 20 }}
    >
      {(shuffledUsers || []).map((user) => (
        <TouchableOpacity
          style={{
            paddingRight: 20,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          key={user.id}
          onPress={() => {
            (navigation as any).navigate("ProfileStack", {
              screen: "ProfileScreen",
              params: { userId: user.id },
            });
          }}
        >
          <ProfileImage
            border={true}
            size={80}
            user={user}
            includeBlank={true}
          />
          <BodyText
            style={{
              marginTop: 4,
              width: 80,
              textAlign: "center",
            }}
            numLines={2}
          >
            {user.username}
          </BodyText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
