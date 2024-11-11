import React from 'react';
import { View, StyleSheet } from 'react-native';

const AppOverlay: React.FC = () => {
  return (
    <View style={styles.overlay} />
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.6,
  },
});

export default AppOverlay;
