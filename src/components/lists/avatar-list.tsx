import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { BodyText } from "../text";
import { Image } from "expo-image";
import { BLURHASH, IMAGEKIT_SMALL_REPLACE } from "../../constants/env";
import { Ionicons } from "@expo/vector-icons";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { getResizedProfileImage } from "../../services/utils";
import { User } from "../../models/user";
import { colors } from "../../constants/colors";

export default function AvatarList({
  avatars,
  totalCount,
  size,
  includeBlank,
  cloudLayout,
}: {
  avatars: string[];
  totalCount: number;
  size?: number;
  includeBlank?: boolean;
  cloudLayout?: boolean;
}) {
  const initialAvatars = useMemo(() => {
    let items = avatars
      .map((item) => (item ? getResizedProfileImage(item) : ""))
      .filter((item) => (includeBlank ? true : item != ""));

    if (cloudLayout) {
      return [...items].splice(0, 8);
    } else {
      return items;
    }
  }, [avatars, includeBlank, cloudLayout]);

  const itemLength = useMemo(() => {
    return initialAvatars.length;
  }, [initialAvatars]);

  const finalAvatars = useMemo(() => {
    let items = initialAvatars;

    if (cloudLayout && items.length > 2) {
      var newItems = [];
      for (var i = Math.ceil(items.length / 2); i < items.length; i++) {
        newItems.push(items[i]);
      }
      for (var i = 0; i < Math.ceil(items.length / 2); i++) {
        newItems.push(items[i]);
      }
      items = newItems;
    }
    return items;
  }, [initialAvatars]);

  const imageSize = useMemo(() => {
    if (size) {
      return size;
    }
    return 30;
  }, [size]);

  if (cloudLayout) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {finalAvatars.map((avatar, index) => {
          return (
            <CloudAvatar
              key={index}
              avatar={avatar}
              index={index}
              itemLength={itemLength}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {finalAvatars.map((avatar, index) => {
        return (
          <SingleAvatar
            key={index}
            avatar={avatar}
            index={index}
            imageSize={imageSize}
            extraStyle={{}}
          />
        );
      })}
      {totalCount > avatars.length && (
        <BodyText style={{ marginLeft: 4, opacity: 0.5, fontSize: 12 }}>{`+${
          totalCount - avatars.length
        }`}</BodyText>
      )}
    </View>
  );
}

function CloudAvatar({ avatar, index, itemLength }) {
  const mainItemIndex = useMemo(() => {
    if (itemLength < 3) {
      return 0;
    }
    if (itemLength % 2 == 0) {
      return Math.ceil(itemLength / 2);
    } else {
      return Math.floor(itemLength / 2);
    }
  }, [itemLength]);

  const outerIndexes = useMemo(() => {
    let returnItems = [];
    if (itemLength > 4) {
      for (var i = 0; i < itemLength; i++) {
        if (i < mainItemIndex - 2) {
          returnItems.push(i);
        } else if (i > mainItemIndex + 1) {
          returnItems.push(i);
        }
      }
    }

    return returnItems;
  }, [itemLength, mainItemIndex]);

  const upItemIndexes = useMemo(() => {
    switch (itemLength) {
      case 1:
        return [];
      case 2:
        return [];
      case 3:
        return [];
      case 4:
        return [1];
      case 5:
        return [1, 4];
      case 6:
        return [2, 5];
      case 7:
        return [0, 2, 5];
      case 8:
        return [1, 3, 6];
    }
    return [];
  }, [itemLength]);

  const imageSize = useMemo(() => {
    if (index == mainItemIndex) {
      if (itemLength < 7) {
        return 50;
      } else {
        return 40;
      }
    }
    if (outerIndexes.includes(index)) {
      return 20;
    }

    return 30;
  }, [mainItemIndex, outerIndexes, index, itemLength]);

  const extraStyle = useMemo(() => {
    if (index == mainItemIndex) {
      return { zIndex: 1 };
    }

    if (upItemIndexes.includes(index)) {
      if (imageSize == 20) {
        if (index > 4 || (itemLength > 7 && index < 3)) {
          return {
            marginTop: -10,
            marginLeft: -12,
          };
        } else {
          return {};
        }
      } else {
        return {
          marginTop: itemLength > 6 ? -50 : -60,
          marginRight: -20,
        };
      }
    }

    if (imageSize == 20) {
      if (index > 5 || (itemLength > 7 && index < 3)) {
        return {
          marginBottom: -20,
          marginRight: -5,
          zIndex: avatar == "" ? 1 : 2,
        };
      } else {
        return {};
      }
    } else {
      return {
        marginBottom: -30,
        zIndex: avatar == "" ? 1 : 2,
      };
    }
  }, [index, mainItemIndex, upItemIndexes, imageSize]);

  return (
    <SingleAvatar
      avatar={avatar}
      index={index}
      imageSize={imageSize}
      extraStyle={extraStyle}
    />
  );
}

function SingleAvatar({ avatar, index, imageSize, extraStyle }) {
  if (avatar) {
    return (
      <Image
        key={index}
        source={{ uri: avatar }}
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          marginLeft: index > 0 ? -8 : 0,
          ...extraStyle,
        }}
      />
    );
  } else {
    return (
      <View
        key={index}
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          backgroundColor: colors.transparentWhite7,
          marginLeft: index > 0 ? -8 : 0,
          justifyContent: "center",
          alignItems: "center",
          ...extraStyle,
        }}
      >
        <Ionicons name="person" size={20} color="black" />
      </View>
    );
  }
}

export function FetchableAvatarList({
  userIds,
  size,
  users,
  setUsers,
  cloudLayout,
}: {
  userIds: string[];
  size?: number;
  users: User[];
  setUsers: any;
  cloudLayout?: boolean;
}) {
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    let promises = [];
    userIds.forEach((userId) => {
      const docRef = doc(getFirestore(), "users", userId);
      promises.push(
        getDoc(docRef).then((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    let users = await Promise.all(promises);
    setUsers(users);
  };

  return (
    <AvatarList
      avatars={users.map((item) => item.profilePicture)}
      totalCount={users.length}
      size={size}
      includeBlank={true}
      cloudLayout={cloudLayout}
    />
  );
}
