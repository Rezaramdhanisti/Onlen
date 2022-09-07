import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  BackHandler,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import {API_URL, ENCRYPT_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToast} from 'react-native-toast-notifications';
import {useFocusEffect} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OneSignal from 'react-native-onesignal';

import styles from './style';

function LoginScreen({navigation}) {
  const [email, setUsernameText] = useState('');
  const [password, setPasswordText] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isSecure, setSecure] = useState(true);
  const toast = useToast();
  console.log('env', ENCRYPT_KEY);

  const securePassword = () => {
    setSecure(!isSecure);
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const onSubmitLogin = async () => {
    const tokenNotification = await OneSignal.getDeviceState();
    setLoading(true);
    const data = {
      email,
      password,
      notificationId: tokenNotification.userId,
    };

    // Encrypt;
    const encryptText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPT_KEY,
    ).toString();
    axios
      .post(`${API_URL}/login`, {data: encryptText})
      .then(async res => {
        storeData(res.data.data.token);
        navigation.navigate('Home');
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@token', value);
    } catch (e) {
      // saving error
    }
  };
  return (
    <ScrollView style={styles.shell}>
      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Masuk ke Dashboard</Text>
        <View style={{marginTop: hp(10), width: wp('70%')}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_email.png')}
            />
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Email"
              placeholderTextColor="#9FA2B4"
              onChangeText={text => {
                setUsernameText(text);
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.password.focus();
              }}
            />
          </View>
          <View
            style={{
              marginTop: 2,
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
            }}
          />
          <View style={{marginTop: hp(4), flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_password.png')}
            />
            <TextInput
              secureTextEntry={isSecure}
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Password"
              placeholderTextColor="#9FA2B4"
              ref={input => {
                this.password = input;
              }}
              onChangeText={text => {
                setPasswordText(text);
              }}
              onSubmitEditing={onSubmitLogin}
            />
            <TouchableOpacity onPress={() => securePassword()}>
              <Image
                style={{width: 20, height: 20, marginTop: 16}}
                source={
                  isSecure
                    ? require('../../../assets/hidden.png')
                    : require('../../../assets/view.png')
                }
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 2,
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
            }}
          />
          <TouchableOpacity
            onPress={onSubmitLogin}
            style={{
              marginTop: hp(6),
              height: 46,
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: '#ff3e6c',
              borderRadius: 8,
            }}>
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <View>
                <Text
                  style={{
                    color: '#f9f9f9',
                    fontSize: 16,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}>
                  Masuk
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 34,
              justifyContent: 'center',
            }}>
            <Text style={[styles.textForgotPass]}>Belum punya akun?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  color: '#ff3e6c',
                  letterSpacing: 0.34,
                  fontWeight: '500',
                  marginLeft: 4,
                }}>
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default LoginScreen;
