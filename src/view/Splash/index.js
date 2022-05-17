import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text, Image, Linking} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function SettingScreen({navigation}) {
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@token');
      if (value !== null) {
        // value previously stored
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
      } else {
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1000);
      }
    } catch (e) {
      // error reading value
    }
  };
  return (
    <View style={styles.shell}>
      <Image
        style={{width: wp(64), height: hp(11)}}
        source={require('../../../assets/logo-onlen.png')}
      />
    </View>
  );
}

export default SettingScreen;
