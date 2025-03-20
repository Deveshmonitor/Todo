import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

const Button = ({onPress, name, disabled}) => {
  return (
    <TouchableOpacity
      className={`${
        disabled ? 'bg-gray-200' : 'bg-blue-500'
      } py-3 my-3  w-full rounded-md`}
      onPress={onPress}
      disabled={disabled}>
      <Text className=" text-center text-base  text-white font-Medium">
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
