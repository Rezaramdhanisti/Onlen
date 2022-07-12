import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import {API_URL, ENCRYPT_KEY} from '@env';
import {useToast} from 'react-native-toast-notifications';

import styles from './styles';

function RegisterScreen({navigation}) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmitRegis = () => {
    setLoading(true);
    const data = {
      businessName,
      email,
      phoneNumber,
      password,
    };

    // Encrypt
    const encryptText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPT_KEY,
    ).toString();

    axios
      .post(`${API_URL}/register`, {data: encryptText})
      .then(res => {
        Alert.alert('Sukses', 'Akun berhasil dibuat!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
        setLoading(false);
      })
      .catch(e => {
        console.log('hahaha', e?.response);
        setLoading(false);
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
  };

  return (
    <ScrollView style={styles.shell}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={{
            width: 28,
            height: 28,
            marginTop: 16,
            alignSelf: 'flex-start',
            left: 26,
          }}
          source={require('../../../assets/ic_close.png')}
        />
      </TouchableOpacity>
      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Daftarkan Bisnis</Text>
        <View style={{marginTop: 44, width: 250}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_user.png')}
            />
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Nama bisnis"
              placeholderTextColor="#d4d4d4"
              onChangeText={text => {
                setBusinessName(text);
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.email.focus();
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
          <View style={{marginTop: 32, flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_email.png')}
            />
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Email"
              placeholderTextColor="#d4d4d4"
              onChangeText={text => {
                setEmail(text);
              }}
              ref={input => {
                this.email = input;
              }}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.phoneNumber.focus();
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
          <View style={{marginTop: 32, flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_password.png')}
            />
            <TextInput
              style={[styles.input]}
              underlineColorAndroid="transparent"
              placeholder="Nomor Handphone"
              placeholderTextColor="#d4d4d4"
              returnKeyType="next"
              onChangeText={text => {
                setPhoneNumber(text);
              }}
              ref={input => {
                this.phoneNumber = input;
              }}
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

          <View style={{marginTop: 32, flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_password.png')}
            />
            <TextInput
              secureTextEntry={true}
              style={[styles.input]}
              underlineColorAndroid="transparent"
              placeholder="Password"
              placeholderTextColor="#d4d4d4"
              onChangeText={text => {
                setPassword(text);
              }}
              ref={input => {
                this.password = input;
              }}
              blurOnSubmit={false}
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
            onPress={onSubmitRegis}
            style={{
              marginTop: 32,
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
                  }}>
                  Daftar
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View
            style={{
              left: 0,
              right: 0,
              height: 1,
              marginTop: 50,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default RegisterScreen;
