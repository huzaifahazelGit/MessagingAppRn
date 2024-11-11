import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import ProfileImage from "../../../components/images/profile-image";
import { BodyText, BoldText } from "../../../components/text";
import { colors } from "../../../constants/colors";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { useUserForId } from "../../../hooks/useUsers";
import { onlyUnique } from "../../../services/utils";
import { Company } from "../../../models/company";

export const CompanyItem = ({
  company,
  tags,
  location,
}: {
  company: Company;
  tags?: string[];
  location?: string;
}) => {
  const navigation = useNavigation();

  const selectedTags = useMemo(() => {
    let items = [];
    tags.forEach((tag) => {
      if (
        company &&
        (company.tags || [])
          .map((item) => `${item}`.toLowerCase().trim())
          .includes(tag.toLowerCase().trim())
      ) {
        items.push(tag);
      }
    });
    if (location) {
      items.push(company.location);
    }

    return items.filter(onlyUnique);
  }, [company, tags]);

  return (
    <TouchableOpacity
      onPress={() => {
        (navigation as any).navigate("CompanyStack", {
          screen: "CompanyProfileScreen",
          params: { companyId: company.id },
        });
      }}
      style={{ paddingHorizontal: 14 }}
    >
      <View
        style={{
          borderBottomColor: colors.transparentWhite7,
          backgroundColor: colors.black,
          borderBottomWidth: 1,
          borderRadius: 4,
          marginVertical: 8,
          paddingHorizontal: 12,
          paddingBottom: 20,
          paddingTop: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            // width: SCREEN_WIDTH - 80,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: -6,
              flex: 1,
            }}
          >
            <ProfileImage
              // @ts-ignore
              user={company}
              size={30}
            />
            <View style={{ marginLeft: 12 }}>
              <BoldText>{company ? company.name : ""}</BoldText>
              {selectedTags.length > 0 ? (
                <View
                  style={{
                    opacity: 0.7,
                    marginTop: 3,

                    maxWidth: SCREEN_WIDTH - 80,
                  }}
                >
                  <BodyText>
                    {selectedTags
                      .map((item) => `${item}`.toLowerCase())
                      .join(", ")}
                  </BodyText>
                </View>
              ) : company.bio ? (
                <View
                  style={{
                    opacity: 0.7,
                    marginTop: 3,
                  }}
                >
                  <BodyText>{company.bio}</BodyText>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
