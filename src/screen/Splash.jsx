import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 2000);
  }, []);

  return (
    <LinearGradient 
      colors={['#4c669f', '#3b5998', '#192f6a']} // Change colors as needed
      className="flex-1 justify-center items-center"
      style={{ flex: 1 }}
    >
      <Animatable.Text 
        className="text-2xl font-bold text-white" 
        animation="fadeInDownBig" 
        duration={2000}
      >
        Technifini 
      </Animatable.Text>
      <Animatable.Text 
        className="text-2xl font-bold text-white" 
        animation="fadeInDownBig" 
        duration={2000}
      >
       Smart ToDo Aplication
      </Animatable.Text>
    </LinearGradient>
  );
};

export default Splash;
