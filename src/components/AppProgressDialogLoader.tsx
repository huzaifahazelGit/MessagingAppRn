import React, {FC} from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';
// import {useSelector} from 'react-redux';

interface ProgressDialogProps {
  visible: boolean;
  label?: string;
  loaderColor?: string;
  labelStyle?: TextStyle;
}
const AppProgressDialogLoader: FC<ProgressDialogProps> = ({
  visible,
  label = 'Please wait...',
  loaderColor = '#0d0',
  labelStyle = {},
}) => {
//   const isLoading = useSelector(
//     (state: any) => state.root.common.isDailogLoading,
//   );
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={loaderColor} />
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#00000089',
    fontSize: 18,
    fontWeight: '700',
    textAlignVertical: 'center',
    marginLeft: 15,
  },
  content: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 80,
    borderRadius: 5,
    width: '80%',
    padding: 20,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export default AppProgressDialogLoader;
