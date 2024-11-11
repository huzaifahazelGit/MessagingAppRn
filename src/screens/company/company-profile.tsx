import { useRoute } from "@react-navigation/native";

import { View } from "react-native";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";

import { doc, getFirestore } from "firebase/firestore";
import { useFirestoreDocData } from "reactfire";

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import { updateDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScrollingSelector from "../../components/buttons/scrolling-selector";
import NavBar from "../../components/navbar";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useProfileColors } from "../../hooks/useProfileColors";
import { Company } from "../../models/company";
import { Post } from "../../models/post";
import { ProfileJukeboxNew } from "../jukebox/jukebox-new";
import { EmptyUser } from "../profile/components/empty-user";
import { ProfileContent } from "../profile/profile-paginators";
import CompanyHeader from "./company-header";
import { ProfileArtists } from "./profile-artists";

export function CompanyProfileScreen() {
  const route = useRoute();
  let params = route.params as any;
  let companyId = params.companyId;

  const ref = doc(getFirestore(), "companies", companyId);

  const { data: company } = useFirestoreDocData(ref);

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };

  useEffect(() => {
    lockOrientation();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <CompanyProfile company={company as any} companyId={companyId} />
    </View>
  );
}

export default function CompanyProfile({
  company,
  companyId,
}: {
  company?: Company;
  companyId: string;
}) {
  const navigation = useNavigation();
  const me = useMe();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState("ARTISTS");
  const [deletedPostIds, setDeletedPostIds] = useState([]);
  const [removedFromJukePostIds, setRemovedFromJukePostIds] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(true);

  const isMyCompany = useMemo(() => {
    return company && me && (company.adminIds || []).includes(me.id);
  }, [me.id, company]);

  const profileColors = useProfileColors(company as any);
  const { textColor, buttonColor, backgroundColor } = profileColors;

  const onShare = async () => {
    // tara here company share
    //   let link = createProfileLink(companyId, me.id);
    //   try {
    //     await Share.open({ url: link });
    //   } catch (error) {
    //     console.log("error 8");
    //     console.log(error);
    //   }
  };

  const onDelete = (post: Post) => {
    setDeletedPostIds([...deletedPostIds, post.id]);
  };

  const header = useMemo(() => {
    return (
      <View
        style={{
          marginTop: 6,
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <CompanyHeader company={company} companyId={companyId} />
        <View style={{ marginTop: 5 }}>
          <ScrollingSelector
            options={["CONTENT", "JUKEBOX", "ARTISTS"]}
            selected={selectedTab}
            setSelected={(tab) => {
              switch (tab) {
                case "CONTENT":
                  setSelectedTab("CONTENT");
                  break;
                case "JUKEBOX":
                  setSelectedTab("JUKEBOX");
                  break;
                case "ARTISTS":
                  setSelectedTab("ARTISTS");
                  break;
              }
            }}
            equalSpacing={true}
            textColor={textColor}
            buttonColor={buttonColor}
          />
        </View>
      </View>
    );
  }, [company, companyId, buttonColor, textColor, selectedTab]);

  const isAdmin = useMemo(() => {
    return me.isAdmin || false;
  }, [me.isAdmin]);

  const toggleFeatured = async () => {
    const userRef = doc(getFirestore(), "companies", companyId);

    if (company && company.featured) {
      await updateDoc(userRef, {
        featured: false,
      });
    } else {
      await updateDoc(userRef, {
        featured: true,
      });
    }
  };

  if (!company) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 14,
          }}
        >
          {me && companyId == me.id ? (
            <EmptyUser />
          ) : (
            <ActivityIndicator color={"white"} />
          )}
        </View>
      </View>
    );
  }

  console.log("company", company.adminIds, me.id);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
    >
      <Image
        source={{ uri: company.profilePicture }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
      />
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.7)", "transparent"]}
        style={{
          width: SCREEN_WIDTH,
          height: 200,
          marginTop: -1 * SCREEN_WIDTH,
        }}
      ></LinearGradient>
      <LinearGradient
        colors={
          company.profilePicture
            ? ["transparent", backgroundColor]
            : [colors.blue, "transparent"]
        }
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH,
          marginTop: -1 * 200,
        }}
      ></LinearGradient>

      {selectedTab == "CONTENT" ? (
        <View style={{ flex: 1 }}>
          <ProfileContent
            header={header}
            onDelete={onDelete}
            profileColors={profileColors}
            companyId={companyId}
            deletedPostIds={deletedPostIds}
            headerVisible={headerVisible}
            setHeaderVisible={setHeaderVisible}
          />
        </View>
      ) : selectedTab == "JUKEBOX" ? (
        <View style={{ flex: 1 }}>
          <ProfileJukeboxNew
            companyId={companyId}
            profileColors={profileColors}
            header={header}
            onDelete={onDelete}
            deletedPostIds={removedFromJukePostIds}
            setDeletedPostIds={setRemovedFromJukePostIds}
            headerVisible={headerVisible}
            setHeaderVisible={setHeaderVisible}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ProfileArtists
            header={header}
            onDelete={onDelete}
            profileColors={profileColors}
            companyId={companyId}
            deletedPostIds={deletedPostIds}
            headerVisible={headerVisible}
            setHeaderVisible={setHeaderVisible}
          />
        </View>
      )}

      <View
        style={{ position: "absolute", top: insets.top, left: 0, right: 0 }}
      >
        <NavBar
          includeBack={true}
          title={""}
          skipTitle={true}
          buttonColor={"white"}
          rightIcon={
            <View style={{ flexDirection: "row" }}>
              {isMyCompany ? (
                <TouchableOpacity
                  style={{ paddingBottom: 8 }}
                  onPress={() => {
                    (navigation as any).navigate("EditCompanyProfileScreen", {
                      companyId: companyId,
                    });
                  }}
                >
                  <Feather name="more-horizontal" size={22} color={"white"} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ paddingBottom: 8 }}
                  onPress={onShare}
                >
                  <Feather name="share" size={22} color={"white"} />
                </TouchableOpacity>
              )}

              {/* {isAdmin ? (
                <TouchableOpacity
                  style={{ paddingBottom: 8, marginLeft: 14 }}
                  onPress={toggleFeatured}
                >
                  <FontAwesome
                    name={company && company.featured ? "star" : "star-o"}
                    size={24}
                    color={"white"}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )} */}
            </View>
          }
        />
        {!headerVisible && (
          <View>
            <ScrollingSelector
              options={["CONTENT", "JUKEBOX", "ARTISTS"]}
              selected={selectedTab}
              setSelected={(tab) => {
                switch (tab) {
                  case "CONTENT":
                    setSelectedTab("CONTENT");
                    break;
                  case "JUKEBOX":
                    setSelectedTab("JUKEBOX");
                    break;
                  case "ARTISTS":
                    setSelectedTab("ARTISTS");
                    break;
                }
              }}
              equalSpacing={true}
              textColor={textColor}
              buttonColor={buttonColor}
            />
          </View>
        )}
      </View>
    </View>
  );
}
