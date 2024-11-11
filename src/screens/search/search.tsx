import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { SearchResultsSongList } from "../../components/audio/search-results-song-list";
import { BodyText, BoldMonoText, BoldText } from "../../components/text";
import { colors } from "../../constants/colors";
import { IS_ANDROID, SCREEN_WIDTH, alpha } from "../../constants/utils";
import { useChallenges } from "../../hooks/useChallenges";
import { useMe } from "../../hooks/useMe";
import { useFeaturedMarketplace, useFeaturedPosts } from "../../hooks/usePosts";
import { Challenge } from "../../models/challenge";
import { Company } from "../../models/company";
import { Playlist } from "../../models/playlist";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { onlyUnique, onlyUniqueIds, shuffle } from "../../services/utils";
import { PostItem } from "../post-item/post-item";
import ArenaGrid from "./components/arena-grid-square";
import { CompanyItem } from "./components/company-item";
import FeaturedUsers from "./components/featured-users";
import Grid, { TextPost } from "./components/grid-square";
import { PlaylistItem } from "./components/playlist-item";
import SearchBar, { EMPTY_SEARCH_PARAMS } from "./components/search-bar";
import { UserItem } from "./components/user-item";
import VideoGrid from "./components/video-grid";
import RAIButton from "../../components/rai/rai-button";
import { SuggestedFollowsModal } from "../../components/modals/suggested-follows-modal";
import { useSigninCheck } from "reactfire";
import { useFeaturedUsers } from "../../hooks/useUsers";
import AppText from "../../components/AppText";

export default function SearchScreen() {
  const me = useMe();
  const navigation = useNavigation();
  const { status, data: signInCheckResult } = useSigninCheck();
  const challenges = useChallenges();
  const [results, setResults] = useState<
    {
      kind:
        | "user"
        | "challenge"
        | "company"
        | "marketplace"
        | "post"
        | "playlist";
      user?: User;
      company?: Company;
      challenge?: Challenge;
      post?: Post;
      playlist?: Playlist;
    }[]
  >([]);

  const [bottomFilterKind, setBottomFilterKind] = useState<
    "posts" | "marketplace" | "arena"
  >("posts");

  const [noResults, setNoResults] = useState(false);
  const [searchParams, setSearchParams] = useState(EMPTY_SEARCH_PARAMS);
  const [searching, setSearching] = useState(false);
  const [letter, setLetter] = useState("-");
  const featuredPosts = useFeaturedPosts(letter);
  const featuredMarketplace = useFeaturedMarketplace();
  const [shuffledPosts, setShuffledPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const featuredUsers = useFeaturedUsers();

  // console.log("--featuredUsers--",featuredUsers);
  

  const [shuffledUsers, setShuffledUsers] = useState([]);

  useEffect(() => {
    if (featuredUsers && featuredUsers.length > 0) {
      setShuffledUsers(shuffle(featuredUsers));
    }
  }, [featuredUsers]);

  const isOnboarded = useMemo(() => {
    if (
      me &&
      me.id &&
      signInCheckResult.signedIn === true &&
      me.profileLoaded
    ) {
      if (!me.username || !me.musicianType) {
        return false;
      }
    }
    return true;
  }, [signInCheckResult, me.id]);

  useEffect(() => {
    if (!isOnboarded) {
      (navigation as any).navigate("Onboarding");
    }
  }, [isOnboarded]);

  useEffect(() => {
    chooseLetter();
  }, []);

  const doRefresh = () => {
    setShuffledPosts([]);
    setShuffledUsers([]);
    chooseLetter();
    setTimeout(() => {
      setShuffledUsers(shuffle(featuredUsers));
    }, 1000);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const chooseLetter = () => {
    let item = alpha[Math.floor(Math.random() * alpha.length)];

    item = item.toUpperCase();

    setLetter(item);
  };

  useEffect(() => {
    if (
      featuredPosts &&
      featuredPosts.length > 0 &&
      shuffledPosts.length == 0
    ) {
      let final = [];
      let textPost = featuredPosts.find((item) => item.kind == "text");
      if (textPost) {
        final.push(textPost);
      }
      final = [...final, ...featuredPosts.filter((item) => item.image)];
      final = final.filter(onlyUniqueIds);
      let extra = final.length % 3;
      setShuffledPosts([...final].splice(0, final.length - extra));
    }
  }, [featuredPosts]);

  const budgetString = useMemo(() => {
    if (searchParams.budget > 0) {
      return `$${searchParams.budget > 1 ? "$" : ""}${
        searchParams.budget > 2 ? "$" : ""
      }${searchParams.budget > 3 ? "$" : ""}`;
    }
    return "";
  }, [searchParams]);

  const relevantTags = useMemo(() => {
    let items = [
      ...searchParams.tags,
      ...searchParams.role.map((item) => item.toLowerCase()),
    ];

    items.push(searchParams.searchKind.toLowerCase());
    if (searchParams.cosignedBy) {
      items.push(`cosigned by ${searchParams.cosignedBy.title}`);
    }
    if (searchParams.budget > 0) {
      items.push(budgetString);
    }

    if (searchParams.location) {
      items.push(searchParams.location.toLowerCase());
    }
    return items.filter(onlyUnique);
  }, [searchParams, budgetString]);

  const shouldShowResults = useMemo(() => {
    return searchParams.query.length > 0 || relevantTags.length > 1;
  }, [searchParams, relevantTags]);

  return (
    <View style={{ flex: 1, paddingTop: IS_ANDROID ? 40 : 0 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        {searching ? (
          <SearchBar
            results={results}
            setResults={setResults}
            setNoResults={setNoResults}
            setSearching={setSearching}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row" }}>
             
              <AppText color={"white"} size={30}> App Rocket</AppText>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSearching(true);
              }}
              style={{
                borderColor: "white",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                width: 35,
                height: 35,
                borderRadius: 35 / 2,
              }}
            >
              <FontAwesome name="search" size={15} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {!searching ? (
       
          <>
          </>
        ) : searchParams.searchKind == "Audio" ? (
          <SearchResultsSongList
            songs={(results || [])
              .map((item) => item.post)
              .filter((item) => item.kind == "audio")}
          />
        ) : searchParams.searchKind == "Video" ? (
          <ScrollView>
            <VideoGrid
              featuredPosts={(results || [])
                .map((item) => item.post)
                .filter((item) => item.kind == "video" && !item.reposted)}
            />
          </ScrollView>
        ) : (
          <FlatList
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            key={searchParams.searchKind}
            // @ts-ignore
            numColumns={searchParams.searchKind == "Playlists" ? 3 : 1}
            data={shouldShowResults ? results : []}
            renderItem={({ item }) =>
              item.kind == "user" ? (
                <View style={{}}>
                  <UserItem
                    user={item.user}
                    tags={relevantTags}
                    location={searchParams.location}
                    AS_CHAT={false}
                  />
                </View>
              ) : item.kind == "company" ? (
                <View style={{}}>
                  <CompanyItem
                    company={item.company}
                    tags={relevantTags}
                    location={searchParams.location}
                  />
                </View>
              ) : item.kind == "playlist" ? (
                <View style={{}}>
                  <PlaylistItem
                    playlist={item.playlist}
                    tags={relevantTags}
                    location={searchParams.location}
                  />
                </View>
              ) : item.kind == "challenge" ? (
                <View
                  style={{
                    paddingHorizontal: 10,
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                  }}
                >
                  <Image
                    source={{ uri: item.challenge.coverImage }}
                    style={{
                      width: SCREEN_WIDTH - 40,
                      height: SCREEN_WIDTH / 2,
                      backgroundColor: colors.transparentWhite1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        (navigation as any).navigate("ArenaDetailScreen", {
                          challengeId: item.challenge.id,
                        })
                      }
                      style={{
                        justifyContent: "flex-end",
                        flex: 1,
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                      }}
                    >
                      <View>
                        <BoldText style={{ fontSize: 16 }}>
                          {item.challenge.title}
                        </BoldText>
                      </View>
                    </TouchableOpacity>
                  </Image>
                </View>
              ) : item.kind == "marketplace" ? (
                <PostItem
                  post={item.post}
                  visible={true}
                  skipAutoPlay={true}
                  marketplace={true}
                  onDelete={(post) => {
                    setResults(
                      [...results].filter(
                        (item) => item.post && item.post.id != post.id
                      )
                    );
                  }}
                />
              ) : (
                <PostItem
                  post={item.post}
                  visible={false}
                  skipAutoPlay={true}
                  onDelete={(post) => {
                    setResults(
                      [...results].filter(
                        (item) => item.post && item.post.id != post.id
                      )
                    );
                  }}
                />
              )
            }
            ListEmptyComponent={
              noResults ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 100,
                  }}
                >
                  <BodyText>No results.</BodyText>
                </View>
              ) : (
                <View />
              )
            }
          />
        )}
      </SafeAreaView>

      <View style={{ position: "absolute", right: 0, bottom: 0 }}>
        <RAIButton stack="search" />
      </View>
    </View>
  );
}
