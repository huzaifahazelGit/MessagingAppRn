import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Linking, Pressable, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BodyText, BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useMe } from "../../hooks/useMe";
import { Company } from "../../models/company";
import { cleanLink } from "../../services/utils";

export default function CompanyHeader({
  company,
  companyId,
}: {
  company?: Company;
  companyId: string;
}) {
  const navigation = useNavigation();
  const me = useMe();

  const isMyCompany = useMemo(() => {
    return company && me && (company.adminIds || []).includes(me.id);
  }, [me.id, company]);

  const textColor = useMemo(() => {
    return company && company.textColor ? company.textColor : colors.white;
  }, [company]);

  const buttonColor = useMemo(() => {
    return company && company.buttonColor ? company.buttonColor : colors.blue;
  }, [company]);

  if (!company) {
    return <View />;
  }

  return (
    <View
      style={{
        paddingBottom: 10,
      }}
    >
      <View style={{ marginTop: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ maxWidth: SCREEN_WIDTH - 80 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <BoldMonoText
                style={{
                  color: textColor,
                  fontSize: 22,
                }}
              >
                {`${company.name}`.toUpperCase()}
              </BoldMonoText>
              {company.verified ? (
                <View style={{ marginLeft: 4, paddingTop: 5 }}>
                  <MaterialIcons
                    name="verified-user"
                    size={18}
                    color={colors.blue}
                  />
                </View>
              ) : (
                <View />
              )}
            </View>

            {company && company.bio ? (
              <BodyText
                style={{
                  color: textColor,
                  marginTop: 2,
                }}
              >
                {company.bio}
              </BodyText>
            ) : (
              <View />
            )}

            {company && company.website ? (
              <Pressable
                style={{ marginTop: 4 }}
                onPress={() => {
                  Linking.openURL(cleanLink(company.website, "website"));
                }}
              >
                <BodyText
                  style={{
                    color: buttonColor,
                  }}
                >
                  {company.website}
                </BodyText>
              </Pressable>
            ) : (
              <View />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
