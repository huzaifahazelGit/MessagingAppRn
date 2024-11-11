import { useNavigation } from "@react-navigation/native";
import { collection, getFirestore, orderBy, where } from "firebase/firestore";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { HeaderPaginator } from "../../components/lists/header-paginator";
import ProfileImage from "../../components/images/profile-image";
import { BoldMonoText } from "../../components/text";
import { DEFAULT_ID, SCREEN_WIDTH } from "../../constants/utils";
import { ProfileColors } from "../../hooks/useProfileColors";

export const ProfileArtists = ({
  onDelete,
  companyId,
  header,
  profileColors,
  deletedPostIds,
  headerVisible,
  setHeaderVisible,
}: {
  onDelete: any;
  profileColors: ProfileColors;
  companyId: string;
  header?: any;
  deletedPostIds: string[];
  headerVisible: boolean;
  setHeaderVisible: any;
}) => {
  const { textColor, buttonColor, backgroundColor } = profileColors;
  const [results, setResults] = useState([]);

  const navigation = useNavigation();

  return (
    <HeaderPaginator
      baseCollection={collection(getFirestore(), "users")}
      queryOptions={[
        where(
          "companyIds",
          "array-contains",
          companyId ? companyId || DEFAULT_ID : DEFAULT_ID
        ),
      ]}
      numColumns={3}
      orderByOption={orderBy("createdate", "desc")}
      needsReload={false}
      header={header}
      style={{ marginTop: -1 * SCREEN_WIDTH + 125 }}
      contentContainerStyle={{ paddingTop: 120 }}
      headerVisible={headerVisible}
      setHeaderVisible={setHeaderVisible}
      setNeedsReload={() => {}}
      setResults={setResults}
      trackVisible={false}
      results={results}
      itemsPerPage={5}
      textColor={textColor}
      listEmptyText={"NO POSTS YET"}
      renderListItem={function (item: any, visible: boolean) {
        return (
          <TouchableOpacity
            style={{
              width: SCREEN_WIDTH / 3 - 4,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 8,
              paddingBottom: 8,
            }}
            onPress={() => {
              (navigation as any).navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: { userId: item.id },
              });
            }}
          >
            <ProfileImage user={item} size={80} />
            <BoldMonoText style={{ marginTop: 4, textAlign: "center" }}>
              {`${item.username}`}
            </BoldMonoText>
          </TouchableOpacity>
        );
      }}
      setLastFetch={() => {}}
    />
  );
};
