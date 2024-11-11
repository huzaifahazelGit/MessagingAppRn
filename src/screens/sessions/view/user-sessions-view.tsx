import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { IS_IOS, SCREEN_WIDTH } from "../../../constants/utils";
import { StoryData } from "../session-constants";
import SingleSessionItem from "./single-session-item";

const perspective = 500;
const A = Math.atan(perspective / (SCREEN_WIDTH / 2));
const ratio = IS_IOS ? 2 : 1.2;

export type StoryController = {
  currentGroupIndex: number;
};

const UserSessionsView = ({
  groupIndex,
  data,
}: {
  data: StoryData[];
  groupIndex: number;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [storyControllers, setStoryControllers] = useState<StoryController[]>();

  const animX = React.useMemo(() => new Animated.Value(1), []);
  const _scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const controllerList = data.map(() => ({
      currentGroupIndex: groupIndex,
    }));
    setStoryControllers(controllerList);
    setLoading(false);
  }, []);

  const _onScrollHandler = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    animX.setValue(x);
  };

  const _onScrollEndHandler = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.floor(x / SCREEN_WIDTH);
    const preIndex = storyControllers[0].currentGroupIndex;
    if (nextIndex !== preIndex) {
      const temp = [...storyControllers];
      temp[preIndex] = { ...temp[preIndex] };
      temp[nextIndex] = { ...temp[nextIndex] };
      for (let x of temp) {
        x.currentGroupIndex = nextIndex;
      }
      setStoryControllers(temp);
    }
  };

  const _getStoryStyle = (index: number) => {
    /**
     * @author William Candillon - Instagram Stories Cube Transition
     *  */
    const offset = index * SCREEN_WIDTH;
    const inputRange = [offset - SCREEN_WIDTH, offset + SCREEN_WIDTH];
    const translateX = animX.interpolate({
      inputRange,
      outputRange: [SCREEN_WIDTH / ratio, -SCREEN_WIDTH / ratio],
      extrapolate: "clamp",
    });

    const translateX1 = animX.interpolate({
      inputRange,
      outputRange: [SCREEN_WIDTH / 2, -SCREEN_WIDTH / 2],
      extrapolate: "clamp",
    });

    const extra = SCREEN_WIDTH / ratio / Math.cos(A / 2) - SCREEN_WIDTH / ratio;
    const translateX2 = animX.interpolate({
      inputRange,
      outputRange: [-extra, extra],
      extrapolate: "clamp",
    });
    return {
      width: SCREEN_WIDTH,
      // ...StyleSheet.absoluteFillObject,

      // transform: [
      //   { perspective },
      //   { translateX },

      //   { translateX: translateX1 },
      //   { translateX: translateX2 },
      // ],
    };
  };

  const _setController = (preGroupIndex: number, nextGroupIndex: number) => {
    if (nextGroupIndex > -1 && nextGroupIndex < data.length) {
      const temp = [...storyControllers];
      temp[nextGroupIndex] = { ...temp[nextGroupIndex] };
      temp[preGroupIndex] = { ...temp[preGroupIndex] };
      for (let x of temp) {
        x.currentGroupIndex = nextGroupIndex;
      }
      _scrollRef.current?.scrollTo({
        x: nextGroupIndex * SCREEN_WIDTH,
        y: 0,
        animated: true,
      });
      setStoryControllers(temp);
    }
  };

  if (loading) return null;
  return (
    <View style={styles.container}>
      <ScrollView
        ref={_scrollRef}
        onLayout={() =>
          _scrollRef.current?.scrollTo({
            x: groupIndex * SCREEN_WIDTH,
            y: 0,
            animated: false,
          })
        }
        bounces={false}
        contentContainerStyle={{
          width: SCREEN_WIDTH * data.length,
        }}
        snapToInterval={SCREEN_WIDTH}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={_onScrollHandler}
        onMomentumScrollEnd={_onScrollEndHandler}
        horizontal={true}
        decelerationRate={0.99}
      >
        {/* <Animated.View
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            ...StyleSheet.absoluteFillObject,
            transform: [
              {
                translateX: animX,
              },
            ],
          }}
        > */}
        {data.map((story, index) => (
          <Animated.View key={index} style={_getStoryStyle(index)}>
            <SingleSessionItem
              maxIndex={data.length - 1}
              setController={_setController}
              data={story}
              index={index}
              controller={storyControllers[index]}
            />
          </Animated.View>
        ))}
        {/* </Animated.View> */}
      </ScrollView>
    </View>
  );
};

export default UserSessionsView;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
