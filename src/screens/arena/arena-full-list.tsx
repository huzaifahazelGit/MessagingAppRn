import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ScreenOrientation from "expo-screen-orientation";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { BoldMonoText } from "../../components/text";
import { colors } from "../../constants/colors";
import { DEFAULT_ID, IS_ANDROID, SCREEN_WIDTH } from "../../constants/utils";
import { useChallenges } from "../../hooks/useChallenges";
import { useMe } from "../../hooks/useMe";
import { useOrientation } from "../../hooks/useOrientation";
import ArenaHorizontalScreen from "./arena-horizontal/arena-horizontal";
import { ArenaItemMedium } from "./components/arena-item-medium";
import { ArenaItemSmall } from "./components/arena-item-small";
import RAIButton from "../../components/rai/rai-button";

export default function ArenaFullListScreen() {
  const unsortedChallenges = useChallenges();
  const [filterKind, setFilterKind] = useState<
    "all" | "submitted" | "live" | "past" | "upcoming"
  >("all");

  const orientation = useOrientation();
  const navigation = useNavigation();
  const [gridView, setGridView] = useState(false);
  const me = useMe();
  const userId = me && me.id ? me.id : DEFAULT_ID;
  const [changing, setChanging] = useState(false);
  const [currentVisibleId, setCurrentVisibleId] = useState("");

  useEffect(() => {
    unlockOrientation();
  }, []);

  const isAdmin = useMemo(() => {
    return me.isAdmin || false;
  }, [me.isAdmin]);

  const allchallenges = useMemo(() => {
    let items = [...unsortedChallenges];
    items.sort((a, b) => {
      if (a.startDate && b.startDate) {
        return b.startDate.seconds - a.startDate.seconds;
      } else {
        return -1;
      }
    });

    if (!isAdmin) {
      return items.filter((item) => !item.daily);
    } else {
      return items;
    }
  }, [unsortedChallenges, isAdmin]);

  const liveChallenges = useMemo(() => {
    return (allchallenges || []).filter((item) => {
      if (item.endDate) {
        if (moment().isBefore(moment(new Date(item.endDate.seconds * 1000)))) {
          if (item.startDate) {
            return moment().isAfter(
              moment(new Date(item.startDate.seconds * 1000))
            );
          }
        }
      }
      return false;
    });
  }, [allchallenges]);

  const pastChallenges = useMemo(() => {
    return (allchallenges || []).filter((item) => {
      if (item.endDate) {
        if (moment(new Date(item.endDate.seconds * 1000)).isBefore(moment())) {
          return true;
        }
      }
      return false;
    });
  }, [allchallenges]);

  const upcomingChallenges = useMemo(() => {
    return (allchallenges || []).filter((item) => {
      if (item.startDate) {
        if (
          moment().isBefore(moment(new Date(item.startDate.seconds * 1000)))
        ) {
          return true;
        }
      }
      return false;
    });
  }, [allchallenges]);

  const challenges = useMemo(() => {
    switch (filterKind) {
      case "all":
        return allchallenges;
      case "submitted":
        return allchallenges.filter((item) => item.memberIds.includes(userId));
      case "live":
        return liveChallenges;
      case "past":
        return pastChallenges;
      case "upcoming":
        return upcomingChallenges;
    }
    return [];
  }, [pastChallenges, upcomingChallenges, liveChallenges, filterKind, userId]);

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  const onScroll = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVisibleId(viewableItems[0].item.id);
    } else {
      setCurrentVisibleId("");
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 20,
  };

  const changeFilterKind = (kind) => {
    setChanging(true);
    setTimeout(() => {
      setChanging(false);
      setFilterKind(kind);
    }, 1000);
  };

  if (orientation != ScreenOrientation.Orientation.PORTRAIT_UP) {
    return <ArenaHorizontalScreen />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.darkblack,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      <View
        style={{
          height: 44,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingBottom: 12,
        }}
      >
        <Image
          source={require("../../../assets/icon-title.png")}
          style={{ width: 180, height: 40 }}
          contentFit="contain"
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <TouchableOpacity
            onPress={() => {
              changeFilterKind(filterKind);
            }}
          >
            <Feather name="refresh-ccw" size={22} color="white" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              (navigation as any).navigate("ArenaDetails", {
                screen: "LeaderboardScreen",
              });
            }}
          >
            <FontAwesome name="trophy" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setChanging(true);
              setTimeout(() => {
                setChanging(false);
                setGridView(!gridView);
              }, 1000);
            }}
            style={{ marginLeft: 10 }}
          >
            {gridView ? (
              <MaterialIcons
                name="panorama-horizontal-select"
                size={24}
                color="white"
              />
            ) : (
              <Ionicons name="grid" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 44 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ height: 44 }}
        >
          <View
            style={{
              height: 44,
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingBottom: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => changeFilterKind("all")}
              style={{
                backgroundColor:
                  filterKind == "all" ? colors.blue : colors.transparent,
                borderColor: filterKind == "all" ? colors.blue : "white",
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <BoldMonoText
                style={{
                  color: filterKind == "all" ? colors.darkblack : "white",
                  fontSize: 16,
                }}
              >
                ALL
              </BoldMonoText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                changeFilterKind("submitted");
              }}
              style={{
                backgroundColor:
                  filterKind == "submitted" ? colors.blue : colors.transparent,
                borderColor: filterKind == "submitted" ? colors.blue : "white",
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginLeft: 14,
              }}
            >
              <BoldMonoText
                style={{
                  color: filterKind == "submitted" ? colors.darkblack : "white",
                  fontSize: 16,
                }}
              >
                SUBMITTED
              </BoldMonoText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changeFilterKind("live")}
              style={{
                backgroundColor:
                  filterKind == "live" ? colors.blue : colors.transparent,
                borderColor: filterKind == "live" ? colors.blue : "white",
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <BoldMonoText
                style={{
                  color: filterKind == "live" ? colors.darkblack : "white",
                  fontSize: 16,
                }}
              >
                LIVE
              </BoldMonoText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => changeFilterKind("upcoming")}
              style={{
                backgroundColor:
                  filterKind == "upcoming" ? colors.blue : colors.transparent,
                borderColor: filterKind == "upcoming" ? colors.blue : "white",
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <BoldMonoText
                style={{
                  color: filterKind == "upcoming" ? colors.darkblack : "white",
                  fontSize: 16,
                }}
              >
                UPCOMING
              </BoldMonoText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => changeFilterKind("past")}
              style={{
                backgroundColor:
                  filterKind == "past" ? colors.blue : colors.transparent,
                borderColor: filterKind == "past" ? colors.blue : "white",
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <BoldMonoText
                style={{
                  color: filterKind == "past" ? colors.darkblack : "white",
                  fontSize: 16,
                }}
              >
                PAST
              </BoldMonoText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {changing ? (
        <ActivityIndicator />
      ) : gridView ? (
        <FlatList
          key={"grid-list"}
          showsVerticalScrollIndicator={false}
          decelerationRate={"fast"}
          snapToInterval={200}
          contentContainerStyle={{
            paddingBottom: 200,
          }}
          data={challenges || []}
          ListEmptyComponent={
            <View>
              <BoldMonoText
                style={{ textAlign: "center", marginTop: 20, color: "white" }}
              >
                {`no ${filterKind} challenges`.toUpperCase()}
              </BoldMonoText>
            </View>
          }
          numColumns={2}
          renderItem={({ item }) => <ArenaItemSmall challenge={item} />}
        />
      ) : (
        <FlatList
          data={challenges}
          key={"scroll-list"}
          snapToInterval={SCREEN_WIDTH - 50}
          contentContainerStyle={{ paddingHorizontal: 35 }}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={"fast"}
          renderItem={({ item }) => {
            return (
              <ArenaItemMedium
                challenge={item}
                visible={currentVisibleId == item.id}
              />
            );
          }}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onScroll}
          ListEmptyComponent={
            <View style={{ width: SCREEN_WIDTH - 40, alignItems: "center" }}>
              <BoldMonoText
                style={{ textAlign: "center", marginTop: 20, color: "white" }}
              >
                {`no ${filterKind} challenges`.toUpperCase()}
              </BoldMonoText>
            </View>
          }
        />
      )}

      <View style={{ position: "absolute", right: 0, bottom: 0 }}>
        <RAIButton stack="arena" />
      </View>
    </SafeAreaView>
  );
}
