import React, { useState } from 'react';
import { Pressable, Image, StyleSheet } from 'react-native';

interface LikeButtonProps {
  onlike: boolean;
  onLikeChange: (newState: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ onlike, onLikeChange }) => {
  const handleLike = () => {
    onLikeChange(!onlike);
  };

  return (
    <Pressable onPress={handleLike} style={styles.imageLikeView}>
      <Image
        source={onlike ? require('../../marketplace/assets/onlike.png') : require('../../marketplace/assets/like.png')}
        style={styles.imageLike}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
    imageLikeView:{
        top:20,
        position:"absolute",
        zIndex:10,
        alignSelf:"flex-end",
        right:10,
      },
      imageLike: {
        width: 22,
        height: 22,
        tintColor:"white",
        resizeMode:"contain",
      },
});

export default LikeButton;
