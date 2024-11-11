import React, { useRef, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Animated, StyleSheet, Dimensions,Text } from 'react-native';
import { SCREEN_HEIGHT } from '../../../constants/utils';

const BottomSheet = ({ visible, onClose, children,sheetView }:any) => {
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <TouchableOpacity style={styles.overlay} onPress={onClose}  />
      <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] },{
        height:SCREEN_HEIGHT/1.3},sheetView]}>
        {children}
        {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.91)',
    // shadowColor:"black",
    // shadowOpacity:0.3
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // padding: 20,
    // paddingBottom: 680, // Additional padding for close button
    
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default BottomSheet;
