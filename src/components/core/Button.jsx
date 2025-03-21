import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

const Button = ({ onPress, name, disabled, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity
      className={`${
        disabled ? 'bg-gray-200' : 'bg-blue-500'
      } py-3 my-3 w-full rounded-md`}
      style={buttonStyle} // Allow custom button styles
      onPress={onPress}
      disabled={disabled}>
      <Text
        className={`text-center text-base font-Medium ${
          disabled ? 'text-gray-500' : 'text-white'
        }`}
        style={textStyle} // Allow custom text styles
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;