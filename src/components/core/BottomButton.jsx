import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

const BottomButton = ({onPress, name}) => {
  return (
    <TouchableOpacity
      className="bg-blue-500 py-4 absolute bottom-0 w-full"
      onPress={onPress}>
      <Text className="text-center font-Bold text-base text-white">
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default BottomButton;
