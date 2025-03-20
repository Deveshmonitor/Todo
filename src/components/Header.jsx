import {Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  LanguageIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';

const Header = ({user}) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-between items-center py-2 px-4 bg-white shadow-xl border-b-[1px] border-gray-200">
      <Image
        source={require('../assets/images/techinifini-logo.webp')}
        className="w-32 h-10"
        resizeMode="contain"
      />

      <View className="flex-row justify-between items-center space-x-6">
        <TouchableOpacity onPress={() => navigation.navigate('Language')}>
          <LanguageIcon size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(user == null ? 'ChooseType' : 'Cart')
          }>
          <ShoppingCartIcon size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(user == null ? 'ChooseType' : 'Account')
          }>
          <UserGroupIcon size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
