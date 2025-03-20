import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';

const Loading = ({isLoading}) => {
  const [visible, setvisible] = useState(isLoading);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setvisible(false);
      }}>
      <View style={styles.centeredView}>
        <ActivityIndicator size={80} color="#808080" />
      </View>
    </Modal>
  );
};

export default Loading;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
