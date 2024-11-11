import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { SCREEN_WIDTH } from "../../constants/utils";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";
import { useMe } from "../../hooks/useMe";
import { useTrackPlayerContext } from "../../hooks/useTrackPlayerContext";
import { Post } from "../../models/post";
import { Submission } from "../../models/submission";
import ProfileImage from "../images/profile-image";
import { BodyText, BoldMonoText, SimpleMonoText } from "../text";
import { SubmissionBackgroundSquare } from "./submission-background-square";
import { Track } from "react-native-track-player";

export default function SubmissionListAudioPlayer({
  posts,
  selectedSubmission,
  setSelectedSubmission,
  canVote,
  showVotes,
  showResults,
  winningSubmissionIds,
  onSubmitVote,
  viewFullSubmission,
  asGrid,
  currentTrack,
}: {
  posts: Submission[];
  selectedSubmission: Submission;
  setSelectedSubmission: any;
  canVote: boolean;
  showVotes: boolean;
  showResults: boolean;
  winningSubmissionIds: string[];
  onSubmitVote: any;
  viewFullSubmission: any;
  asGrid: boolean;
  currentTrack: Track;
}) {
  const { pauseCurrentTrack, playTrackById, isPlaying } =
    useTrackPlayerContext();

  const me = useMe();

  const selectTrack = async (post: Post) => {
    if (currentTrack && post.id == currentTrack.id && isPlaying) {
      pauseCurrentTrack();
    } else {
      playTrackById(post.id);
    }
  };

  const didVote = useMemo(() => {
    return (
      (posts || []).filter((item) => (item.votes || []).includes(me.id))
        .length > 0
    );
  }, [posts]);

  if (!asGrid) {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((item, index) => (
          <ListSubmissionItem
            key={item.id}
            submission={item}
            setSelectedSubmission={setSelectedSubmission}
            selectedSubmission={selectedSubmission}
            didVote={didVote}
            index={index}
            selectTrack={selectTrack}
            currentTrack={currentTrack}
            canVote={canVote}
            showResults={showResults}
            winningSubmissionIds={winningSubmissionIds}
            showVotes={showVotes}
            onSubmitVote={onSubmitVote}
            viewFullSubmission={viewFullSubmission}
            loading={false}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={posts}
      numColumns={2}
      contentContainerStyle={{
        paddingBottom: 60,
      }}
      ListEmptyComponent={
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 100,
          }}
        >
          <BodyText style={{ color: "black" }}>NO SUBMISSIONS YET</BodyText>
        </View>
      }
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <GridSubmissionItem
          submission={item}
          currentTrack={currentTrack}
          setSelectedSubmission={setSelectedSubmission}
          selectedSubmission={selectedSubmission}
          didVote={didVote}
          index={index}
          selectTrack={selectTrack}
          canVote={canVote}
          showResults={showResults}
          winningSubmissionIds={winningSubmissionIds}
          showVotes={showVotes}
          onSubmitVote={onSubmitVote}
          viewFullSubmission={viewFullSubmission}
          loading={false}
        />
      )}
    />
  );
}

const GridSubmissionItem = ({
  submission,
  setSelectedSubmission,
  selectedSubmission,
  didVote,
  canVote,
  selectTrack,
  currentTrack,
  showResults,
  showVotes,
  winningSubmissionIds,
  onSubmitVote,
  viewFullSubmission,
  loading,
  index,
}) => {
  const me = useMe();

  const { isPlaying } = useTrackPlayerContext();

  const currentSongIsPlaying = useMemo(() => {
    return currentTrack && currentTrack.id == submission.id && isPlaying;
  }, [currentTrack, submission, isPlaying]);

  let squareWidth = (SCREEN_WIDTH - 30) / 2;

  return (
    <View
      style={{
        width: SCREEN_WIDTH / 2,
        height: SCREEN_WIDTH / 2,
        paddingLeft: index % 2 == 0 ? 10 : 5,
        paddingRight: index % 2 == 0 ? 5 : 10,
      }}
    >
      <Pressable
        onPress={() => {
          if (selectedSubmission?.id == submission.id) {
            setSelectedSubmission(null);
          } else {
            setSelectedSubmission(submission);
          }
        }}
      >
        <SubmissionBackgroundSquare
          submission={submission}
          skipFakeBackground={false}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          style={{
            width: squareWidth,
            height: squareWidth,
            marginTop: -1 * squareWidth,
            justifyContent: "flex-end",
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          <View>
            {!showResults &&
              didVote &&
              (submission.votes || []).includes(me.id) && (
                <View
                  style={{
                    height: SCREEN_WIDTH / 2 - 50,
                    paddingVertical: 12,
                  }}
                >
                  <FontAwesome name="star" size={24} color={colors.white} />
                </View>
              )}
            {selectedSubmission?.id == submission.id && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: SCREEN_WIDTH / 2 - 50,
                  paddingTop: 30,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {canVote && (
                    <Pressable
                      style={{
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "white",
                        backgroundColor: "white",
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        marginRight: 4,
                      }}
                      onPress={() => {
                        onSubmitVote(submission);
                      }}
                    >
                      <BoldMonoText style={{ color: "black" }}>
                        VOTE
                      </BoldMonoText>
                    </Pressable>
                  )}
                  <Pressable
                    style={{
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "white",
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                    }}
                    onPress={() => {
                      viewFullSubmission(submission);
                    }}
                  >
                    <BoldMonoText>MORE</BoldMonoText>
                  </Pressable>
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <View>
                {showResults ? (
                  winningSubmissionIds.includes(submission.id) ? (
                    <FontAwesome name="trophy" size={24} color={colors.white} />
                  ) : showVotes && (submission.votes || []).length > 0 ? (
                    <BoldMonoText>{`${submission.votes.length} vote${
                      submission.votes.length == 1 ? "" : "s"
                    }`}</BoldMonoText>
                  ) : (
                    <View />
                  )
                ) : (
                  <View />
                )}
              </View>
              <Pressable
                onPress={() => {
                  if (submission && submission.audio) {
                    selectTrack(submission);
                  } else {
                    viewFullSubmission(submission);
                  }
                }}
                style={{
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 40 / 2,
                }}
              >
                {loading ? (
                  <ActivityIndicator animating color={"black"} />
                ) : (
                  <MaterialIcons
                    name={currentSongIsPlaying ? `pause` : `play-arrow`}
                    color={colors.transparentBlack7}
                    size={24}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const ListSubmissionItem = ({
  submission,
  setSelectedSubmission,
  selectedSubmission,
  didVote,
  canVote,
  selectTrack,
  currentTrack,
  showResults,
  showVotes,
  winningSubmissionIds,
  onSubmitVote,
  viewFullSubmission,
  loading,
  index,
}) => {
  const me = useMe();
  const { isPlaying } = useTrackPlayerContext();

  const currentSongIsPlaying = useMemo(() => {
    return currentTrack && currentTrack.id == submission.id && isPlaying;
  }, [currentTrack, submission, isPlaying]);

  const isSelected = useMemo(() => {
    return selectedSubmission?.id == submission.id;
  }, [selectedSubmission, submission]);

  const hasStar = useMemo(() => {
    return didVote && (submission.votes || []).includes(me.id);
  }, [didVote, submission, me.id]);

  const hasTropy = useMemo(() => {
    return showResults && winningSubmissionIds.includes(submission.id);
  }, [showResults, winningSubmissionIds, submission]);

  const showVoteCount = useMemo(() => {
    return (
      showResults &&
      showVotes &&
      (submission.votes || []).length > 0 &&
      !hasTropy
    );
  }, [showResults, showVotes, submission, hasTropy]);

  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 20,
      }}
    >
      <Pressable
        onPress={() => {
          setSelectedSubmission(submission);
          selectTrack(submission);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ProfileImage
              user={{ profilePicture: submission.userImage } as any}
              size={42}
              border={true}
              borderColor={isSelected ? colors.purple : colors.white}
            />
            <View
              style={{
                marginLeft: 18,
                width:
                  currentSongIsPlaying || hasStar || hasTropy || showVoteCount
                    ? SCREEN_WIDTH - 160
                    : SCREEN_WIDTH - 120,
              }}
            >
              <BoldMonoText
                style={{
                  fontSize: 17,
                  color: isSelected ? colors.purple : colors.white,
                }}
              >
                {submission.username}
              </BoldMonoText>
              <SimpleMonoText
                style={{
                  marginTop: 3,
                  color: isSelected ? colors.purple : colors.white,
                }}
                numLines={1}
              >
                {submission.uploadTitle}
              </SimpleMonoText>
            </View>

            {showResults ? (
              hasTropy ? (
                <FontAwesome name="trophy" size={24} color={colors.blue} />
              ) : showVoteCount ? (
                <BoldMonoText>{`${submission.votes.length} vote${
                  submission.votes.length == 1 ? "" : "s"
                }`}</BoldMonoText>
              ) : (
                <View />
              )
            ) : (
              hasStar && (
                <View
                  style={{
                    paddingVertical: 12,
                  }}
                >
                  <FontAwesome name="star" size={24} color={colors.purple} />
                </View>
              )
            )}
          </View>
          <View style={{}}>
            {loading ? (
              <ActivityIndicator animating color={"white"} />
            ) : currentTrack && currentTrack.id == submission.id ? (
              <MaterialIcons
                name={currentSongIsPlaying ? `pause` : `play-arrow`}
                color={colors.white}
                size={24}
              />
            ) : (
              <View />
            )}
          </View>
          {/* <View>
           
            </View> */}
        </View>
      </Pressable>
    </View>
  );
};
