import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import ArenaDetailScreen from "../screens/arena/arena-detail/arena-detail";
import ArenaDetailSelect from "../screens/arena/arena-detail/arena-detail-select";
import ArenaDetailVoteScreen from "../screens/arena/arena-detail/arena-detail-vote";
import ArenaFullListScreen from "../screens/arena/arena-full-list";
import LeaderboardContainerScreen from "../screens/arena/leaderboard/leaderboard-container";
import ArenaDetailUploadSubmission from "../screens/create/submission/submission-form";
import LeaderboardDetailScreen from "../screens/arena/leaderboard/leaderboard-detail";
import ArenaDetailViewSubmissionsScreen from "../screens/arena/arena-detail/arena-detail-view-submissions";
import ConfirmWinnerScreen from "../screens/arena/arena-detail/confirm-winner-screen";
import ArenaDetailChooseMultipleChoiceScreen from "../screens/arena/arena-detail/arena-detail-choose-mc";

const ArenaStack = createNativeStackNavigator();

export default function ArenaNavigator() {
  return (
    <ArenaStack.Navigator
      screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}
      initialRouteName={"ArenaFullListScreen"}
    >
      <ArenaStack.Screen
        name="ArenaFullListScreen"
        component={ArenaFullListScreen}
      />

      <ArenaStack.Screen
        name="ArenaDetailScreen"
        component={ArenaDetailScreen}
      />

      <ArenaStack.Screen
        name="ArenaDetailSelect"
        component={ArenaDetailSelect}
      />

      <ArenaStack.Screen
        name="ArenaDetailUploadSubmission"
        component={ArenaDetailUploadSubmission}
      />

      <ArenaStack.Screen
        name="ArenaDetailVoteScreen"
        component={ArenaDetailVoteScreen}
      />

      <ArenaStack.Screen
        name="ArenaDetailChooseMCScreen"
        component={ArenaDetailChooseMultipleChoiceScreen}
      />

      <ArenaStack.Screen
        name="ArenaDetailViewSubmissionsScreen"
        component={ArenaDetailViewSubmissionsScreen}
      />

      <ArenaStack.Screen
        name="ConfirmWinnerScreen"
        component={ConfirmWinnerScreen}
      />

      <ArenaStack.Screen
        name="LeaderboardScreen"
        component={LeaderboardContainerScreen}
      />

      <ArenaStack.Screen
        name="LeaderboardDetailScreen"
        component={LeaderboardDetailScreen}
      />
    </ArenaStack.Navigator>
  );
}
