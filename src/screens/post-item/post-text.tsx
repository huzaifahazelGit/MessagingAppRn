import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Text } from "react-native";
import {
  Part,
  isMentionPartType,
  parseValue,
} from "react-native-controlled-mentions";
import Hyperlink from "react-native-hyperlink";
import { BodyText } from "../../components/text";
import { colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { User } from "../../models/user";
import { IS_ANDROID } from "../../constants/utils";
import ReadMore from "react-native-read-more-text";
import { textHasLink } from "../../services/utils";

export function PostText({
  text,
  profile,
  fontsize,
  user,
  textColorOverride,
  skipReadMore,
}: {
  text: string;
  profile?: boolean;
  fontsize?: number;
  user?: User;
  textColorOverride?: string;
  skipReadMore?: boolean;
}) {
  const navigation = useNavigation();

  const buttonColor = useMemo(() => {
    return profile && user && user.buttonColor ? user.buttonColor : colors.blue;
  }, [user, profile]);

  const textColor = useMemo(() => {
    return textColorOverride
      ? textColorOverride
      : profile && user && user.textColor
      ? user.textColor
      : colors.white;
  }, [user, profile, textColorOverride]);

  const descriptionParts = useMemo(() => {
    const { parts } = parseValue(text, [
      {
        trigger: "@",
      },
    ]);
    return parts;
  }, [text]);

  const renderPart = (part: Part, index: number) => {
    if (!part.partType) {
      return part.text;
    }

    if (isMentionPartType(part.partType)) {
      return (
        <Text
          key={`${index}-${part.data?.trigger}`}
          style={{ fontFamily: Fonts.Bold, color: buttonColor }}
          onPress={() =>
            (navigation as any).navigate("ProfileStack", {
              screen: "ProfileScreen",
              params: { userId: part.data?.id },
            })
          }
        >
          {part.text}
        </Text>
      );
    }

    return <Text></Text>;
  };

  const _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{
          fontFamily: Fonts.Regular,
          color: textColor,
          textDecorationLine: "underline",
          textDecorationColor: textColor,
          fontSize: fontsize ? fontsize : 12,
          opacity: 0.8,
        }}
        onPress={handlePress}
      >
        more
      </Text>
    );
  };

  const _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{
          fontFamily: Fonts.Regular,
          color: textColor,
          textDecorationLine: "underline",
          textDecorationColor: textColor,
          fontSize: fontsize ? fontsize : 12,
          opacity: 0.8,
        }}
        onPress={handlePress}
      >
        less
      </Text>
    );
  };

  if (IS_ANDROID) {
    return (
      <BodyText
        style={{
          color: textColor,
          fontSize: fontsize ? fontsize : 12,
          fontFamily: Fonts.Regular,
        }}
      >
        {descriptionParts.map(renderPart)}
      </BodyText>
    );
  }

  if (textHasLink(text) || skipReadMore) {
    return (
      <Hyperlink
        linkDefault={true}
        linkStyle={{ fontFamily: Fonts.Regular, color: buttonColor }}
      >
        <BodyText
          style={{
            color: textColor,
            fontSize: fontsize ? fontsize : 12,
            fontFamily: Fonts.Regular,
          }}
        >
          {descriptionParts.map(renderPart)}
        </BodyText>
      </Hyperlink>
    );
  }

  return (
    <ReadMore
      numberOfLines={10}
      renderTruncatedFooter={_renderTruncatedFooter}
      renderRevealedFooter={_renderRevealedFooter}
    >
      <BodyText
        style={{
          color: textColor,
          fontSize: fontsize ? fontsize : 12,
          fontFamily: Fonts.Regular,
        }}
      >
        {descriptionParts.map(renderPart)}
      </BodyText>
    </ReadMore>
  );
}
