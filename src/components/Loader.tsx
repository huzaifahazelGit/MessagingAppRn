import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ isLoading,loaderView }:any) => {
  if (!isLoading) return null;

  return (
    <View style={[styles.loaderContainer,loaderView]}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000, // Ensure it appears on top of other elements
  },
});

export default Loader;
