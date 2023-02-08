import React, {useEffect} from 'react';
import {View, Image, StatusBar} from 'react-native';

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
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      <Image
        style={{width: wp(62), height: hp(14)}}
        source={require('../../../assets/logo-onlen.png')}
        resizeMode={'contain'}
      />
    </View>
  );
}

export default SettingScreen;
