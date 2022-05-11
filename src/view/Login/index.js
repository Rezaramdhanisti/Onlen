import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Image, TextInput} from 'react-native';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import {API_URL, ENCRYPT_KEY} from '@env';
import {useToast} from 'react-native-toast-notifications';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function LoginScreen({navigation}) {
  const [email, setUsernameText] = useState('');
  const [password, setPasswordText] = useState('');
  const toast = useToast();

  const onSubmitLogin = () => {
    const data = {
      email,
      password,
    };

    // Encrypt;
    const encryptText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPT_KEY,
    ).toString();
    axios
      .post(`${API_URL}/login`, {data: encryptText})
      .then(async res => {
        console.log('sukses', res, email);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
  };

  return (
    <View style={styles.shell}>
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
              secureTextEntry={true}
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
              onSubmitEditing={this._loginUsingEmail}
            />
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
    </View>
  );
}

export default LoginScreen;
