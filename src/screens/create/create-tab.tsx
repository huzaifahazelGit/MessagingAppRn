import { useRoute } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { SafeAreaView, View } from "react-native";
import ScrollingSelector from "../../components/buttons/scrolling-selector";
import { colors } from "../../constants/colors";
import { useMe } from "../../hooks/useMe";
import ArenaPostForm from "./arena/arena-post-form";
import MarketplacePostForm from "./marketplace/marketplace-post-form";
import FeedPostForm from "./post/feed-post-form";
import { IS_ANDROID } from "../../constants/utils";
import MarketNavigator from "../../navigation/market-stack";

export default function CreateTabScreen() {
  const route = useRoute();
  const me = useMe();
  const [selectedTab, setSelectedTab] = useState("FEED");

  const isAdmin = useMemo(() => {
    return me.isAdmin || false;
  }, [me.isAdmin]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
        paddingTop: IS_ANDROID ? 40 : 0,
      }}
    >
      {selectedTab === "FEED" ? (
        <FeedPostForm />
      ) : selectedTab == "MARKET" ? (
        <MarketNavigator />
      ) : (
        <ArenaPostForm />
      )}

      <View
        style={
          isAdmin
            ? {
                paddingLeft: 8,
              }
            : {}
        }
      >
        <ScrollingSelector
          equalSpacing={true}
          horizontalPadding={40}
          buttonColor={colors.purple}
          bottomBarHeight={8}
          options={isAdmin ? ["FEED", "MARKET", "ARENA"] : ["FEED", ""]}
          selected={selectedTab}
          notSelectedColor={colors.black}
          setSelected={setSelectedTab}
        />
      </View>
    </SafeAreaView>
  );
}
