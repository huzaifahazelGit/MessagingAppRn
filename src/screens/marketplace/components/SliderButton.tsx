import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const SliderButton = ({ market_list, selectedMarket, setSelectedMarket }) => {
  const translateX = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.scrollContainer, animatedStyle]}>
          {market_list.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.button,
                { backgroundColor: selectedMarket.id === item.id ? 'blue' : 'gray' },
              ]}
              onPress={() => setSelectedMarket(item)}
            >
              <Text style={styles.text}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    overflow: 'hidden',
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
  },
  text: {
    color: 'white',
  },
});

export default SliderButton;
