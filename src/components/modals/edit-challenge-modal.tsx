import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Switch, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BodyText } from "../../components/text";
import { colors } from "../../constants/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/utils";
import { Challenge } from "../../models/challenge";
import { DatePickerInnerModal } from "../upload-wrappers/datepicker-button";
import { TagPickerInnerModal } from "../upload-wrappers/tags-wrapper";
import { TextInputInnerModal } from "../upload-wrappers/text-input-modal";
import { useChallengeContext } from "../../hooks/useChallengeContext";

export const EditChallengeModal = ({
  challenge,
  onDelete,
  showModal,
  setShowModal,
}: {
  challenge: Challenge;
  onDelete: any;
  showModal: boolean;
  setShowModal: any;
}) => {
  const { onUpdateChallenge } = useChallengeContext();
  const [currentPost, setCurrentPost] = useState(challenge);

  const [newStartDate, setNewStartDate] = useState(new Date());
  const [showingStartDate, setShowingStartDate] = useState(false);

  const [newEndDate, setNewEndDate] = useState(new Date());
  const [showingEndDate, setShowingEndDate] = useState(false);

  const [newVoteDate, setNewVoteDate] = useState(new Date());
  const [showingVoteDate, setShowingVoteDate] = useState(false);

  const [newTags, setNewTags] = useState(challenge.tags || []);
  const [showingTags, setShowingTags] = useState(false);

  const [newText, setNewText] = useState(challenge.description || "");
  const [showingText, setShowingText] = useState(false);

  const [newTitle, setNewTitle] = useState(challenge.title || "");
  const [showingTitle, setShowingTitle] = useState(false);

  useEffect(() => {
    if (challenge && challenge.endDate) {
      setNewEndDate(new Date(challenge.endDate.seconds * 1000));
    }
    if (challenge && challenge.startDate) {
      setNewStartDate(new Date(challenge.startDate.seconds * 1000));
    }
    if (challenge && challenge.voteDate) {
      setNewVoteDate(new Date(challenge.voteDate.seconds * 1000));
    }
  }, []);

  const deletePost = async () => {
    if (currentPost) {
      setShowModal(false);
      Alert.alert(
        "Delete Challenge",
        "Are you sure you want to delete this challenge?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await updateDoc(
                doc(getFirestore(), "challenges", currentPost.id),
                {
                  archived: true,
                }
              );

              onDelete(currentPost);
            },
          },
        ]
      );
    }
  };

  const onClickItem = (title: string) => {
    if (title == "Announcement Date") {
      setShowingStartDate(true);
    }
    if (title == "Submission Deadline") {
      setShowingEndDate(true);
    }
    if (title == "Voting Ends") {
      setShowingVoteDate(true);
    }

    if (title == "Edit Description") {
      setShowingText(true);
    }

    if (title == "Edit Title") {
      setShowingTitle(true);
    }

    if (title == "Add/remove Tags") {
      setShowingTags(true);
    }
    if (title == "Delete Challenge") {
      deletePost();
      setShowModal(false);
    }
  };

  var options = useMemo(() => {
    if (!currentPost) {
      return [];
    }

    let items = [
      {
        title: "Edit Title",
        icon: "edit",
        kind: "arrow",
      },
      {
        title: "Edit Description",
        icon: "text-height",
        kind: "arrow",
      },
      {
        title: "Announcement Date",
        icon: "clock-o",
        kind: "arrow",
      },
      {
        title: "Submission Deadline",
        icon: "clock-o",
        kind: "arrow",
      },
    ];
    if (challenge.allowsVoting) {
      items.push({
        title: "Voting Ends",
        icon: "clock-o",
        kind: "arrow",
      });
    }

    // items.push({
    //   title: "Add/remove Tags",
    //   icon: "tag",
    //   kind: "arrow",
    // });

    items.push({
      title: "Voting Enabled",
      icon: "arrow-circle-o-down",
      kind: "toggle",
    });
    items.push({
      title: "Link & Video Submissions Enabled",
      icon: "link",
      kind: "toggle",
    });
    items.push({
      title: "Featured Challenge",
      icon: "star",
      kind: "toggle",
    });

    // items.push({
    //   title: "Profile Requirements",
    //   icon: "sliders",
    //   kind: "arrow",
    // });

    items.push({
      title: "Delete Challenge",
      icon: "close",
      kind: "arrow",
    });

    return items;
  }, [currentPost]);

  const toggleVotingEnabled = async () => {
    updatePost({ allowsVoting: !currentPost.allowsVoting });
    setCurrentPost({ ...currentPost, allowsVoting: !currentPost.allowsVoting });
  };

  const toggleFeatured = async () => {
    updatePost({ featured: !currentPost.featured });
    setCurrentPost({ ...currentPost, featured: !currentPost.featured });
  };

  const toggleVideoEnabled = async () => {
    updatePost({ allowsVideo: !currentPost.allowsVideo });
    setCurrentPost({ ...currentPost, allowsVideo: !currentPost.allowsVideo });
  };

  const updatePost = async (updates) => {
    await updateDoc(doc(getFirestore(), "challenges", currentPost.id), {
      ...updates,
    });
    var challenge = {
      ...currentPost,
      ...updates,
    };
    onUpdateChallenge(challenge);
  };

  return (
    <Modal visible={showModal} transparent={true} animationType="fade">
      {showingTags ? (
        <TagPickerInnerModal
          setShowModal={setShowingTags}
          confirm={() => {
            updatePost({ tags: newTags });
            setCurrentPost({ ...currentPost, tags: newTags });
            setShowingTags(false);
          }}
          tags={newTags}
          setTags={setNewTags}
        />
      ) : showingText ? (
        <TextInputInnerModal
          setShowModal={setShowingText}
          confirm={() => {
            updatePost({ description: newText });
            setCurrentPost({ ...currentPost, description: newText });
            setShowingText(false);
          }}
          modalTitle={"Edit Description"}
          text={newText}
          setText={setNewText}
        />
      ) : showingTitle ? (
        <TextInputInnerModal
          setShowModal={setShowingTitle}
          confirm={() => {
            updatePost({ title: newTitle });
            setCurrentPost({ ...currentPost, title: newTitle });
            setShowingTitle(false);
          }}
          modalTitle={"Edit Title"}
          text={newTitle}
          setText={setNewTitle}
        />
      ) : showingStartDate ? (
        <DatePickerInnerModal
          setShowModal={(showing) => {
            if (!showing) {
              updatePost({ startDate: newStartDate });
              // @ts-ignore
              setCurrentPost({ ...currentPost, startDate: newStartDate });
              setShowingStartDate(false);
            }
          }}
          includeTime={true}
          date={newStartDate}
          setDate={setNewStartDate}
        />
      ) : showingEndDate ? (
        <DatePickerInnerModal
          setShowModal={(showing) => {
            if (!showing) {
              updatePost({ endDate: newEndDate });
              if (currentPost.allowsVoting) {
                // @ts-ignore
                setCurrentPost({ ...currentPost, endDate: newEndDate });
              } else {
                // @ts-ignore
                setCurrentPost({
                  ...currentPost,
                  endDate: newEndDate,
                  voteDate: newEndDate,
                });
              }

              setShowingEndDate(false);
            }
          }}
          includeTime={true}
          date={newEndDate}
          setDate={setNewEndDate}
        />
      ) : showingVoteDate ? (
        <DatePickerInnerModal
          setShowModal={(showing) => {
            if (!showing) {
              updatePost({ voteDate: newVoteDate });
              // @ts-ignore
              setCurrentPost({ ...currentPost, voteDate: newVoteDate });
              setShowingVoteDate(false);
            }
          }}
          includeTime={true}
          date={newVoteDate}
          setDate={setNewVoteDate}
        />
      ) : (
        <SafeAreaView style={{ justifyContent: "flex-end", flex: 1 }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: colors.transparentBlack7 }}
            onPress={() => setShowModal(false)}
          ></TouchableOpacity>
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingBottom: 40,
              minHeight: SCREEN_HEIGHT * 0.6,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 12,
                paddingBottom: 12,

                marginHorizontal: 12,
                marginBottom: 30,
              }}
            >
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Entypo name="chevron-down" size={24} color={colors.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 12 }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.title}
                  style={{
                    paddingVertical: option.kind == "toggle" ? 4 : 12,
                    borderBottomColor: colors.gray,
                    borderBottomWidth: 1,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 6,
                  }}
                  onPress={() => {
                    onClickItem(option.title);
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <FontAwesome
                      //   @ts-ignore
                      name={option.icon}
                      size={18}
                      style={{ marginRight: 12 }}
                      color={
                        option.title == "Delete Challenge"
                          ? "red"
                          : colors.black
                      }
                    />
                    <BodyText
                      style={{
                        color:
                          option.title == "Delete Challenge"
                            ? "red"
                            : colors.black,
                      }}
                    >
                      {option.title}
                    </BodyText>
                  </View>
                  <View>
                    {option.kind == "arrow" ? (
                      <View style={{ flexDirection: "row" }}>
                        {option.title == "Announcement Date" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {currentPost.startDate
                                ? moment(
                                    currentPost.startDate.seconds
                                      ? new Date(
                                          currentPost.startDate.seconds * 1000
                                        )
                                      : currentPost.startDate
                                  ).format("MMM Do")
                                : ""}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Submission Deadline" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {currentPost.endDate
                                ? moment(
                                    currentPost.endDate.seconds
                                      ? new Date(
                                          currentPost.endDate.seconds * 1000
                                        )
                                      : currentPost.endDate
                                  ).format("MMM Do")
                                : ""}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Voting Ends" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {currentPost.voteDate
                                ? moment(
                                    currentPost.voteDate.seconds
                                      ? new Date(
                                          currentPost.voteDate.seconds * 1000
                                        )
                                      : currentPost.voteDate
                                  ).format("MMM Do")
                                : ""}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Edit Description" && (
                          <View>
                            <BodyText
                              style={{
                                color: colors.black,
                                maxWidth: SCREEN_WIDTH * 0.45,
                              }}
                              numLines={1}
                            >
                              {currentPost.description}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Edit Title" && (
                          <View>
                            <BodyText
                              style={{
                                color: colors.black,
                                maxWidth: SCREEN_WIDTH * 0.45,
                              }}
                              numLines={1}
                            >
                              {currentPost.title}
                            </BodyText>
                          </View>
                        )}
                        {option.title == "Add/remove Tags" && (
                          <View>
                            <BodyText style={{ color: colors.black }}>
                              {`${
                                (currentPost.tags || []).length > 0 ? "#" : ""
                              }${(currentPost.tags || []).join(" #")}`}
                            </BodyText>
                          </View>
                        )}
                        {option.title != "Delete Challenge" && (
                          <AntDesign
                            name="right"
                            size={14}
                            color={colors.gray}
                          />
                        )}
                      </View>
                    ) : (
                      <View>
                        <Switch
                          trackColor={{
                            false: colors.softWhite,
                            true: colors.blue,
                          }}
                          thumbColor={colors.white}
                          ios_backgroundColor={colors.softWhite}
                          onValueChange={() => {
                            if (option.title == "Voting Enabled") {
                              toggleVotingEnabled();
                            } else if (option.title == "Featured Challenge") {
                              toggleFeatured();
                            } else if (
                              option.title == "Link & Video Submissions Enabled"
                            ) {
                              toggleVideoEnabled();
                            }
                          }}
                          value={
                            option.title == "Voting Enabled"
                              ? currentPost.allowsVoting
                              : option.title ==
                                "Link & Video Submissions Enabled"
                              ? currentPost.allowsVideo
                              : currentPost.featured
                          }
                          style={{
                            transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                          }}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
};
