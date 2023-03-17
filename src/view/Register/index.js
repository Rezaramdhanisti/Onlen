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
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './styles';

function RegisterScreen({navigation}) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isSecure, setSecure] = useState(true);
  const [isSecureConfirm, setSecureConfirm] = useState(true);
  const [showError, setShowError] = useState(false);
  const toast = useToast();
  const [modalSuccess, setModalSuccess] = useState(false);
  const [referralCode, setreferralCode] = useState('');

  const securePassword = () => {
    setSecure(!isSecure);
  };
  const validationBusinessName = text => {
    let regSpace = new RegExp(/^[a-zA-Z0-9_.-]*$/); // what should i add to check *%#:& currently its checking only white space
    // Check for white space and (*%#:&)
    if (regSpace.test(text)) {
      setBusinessName(text);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const securePasswordConfirm = () => {
    setSecureConfirm(!isSecureConfirm);
  };

  const onSubmitRegis = () => {
    if (businessName.length < 1) {
      return toast.show('Nama bisnis tidak boleh kosong', {type: 'danger'});
    } else if (email.length < 1) {
      return toast.show('Email tidak boleh kosong', {type: 'danger'});
    } else if (phoneNumber.length < 1) {
      return toast.show('Nomor handphone tidak boleh kosong', {type: 'danger'});
    } else if (password.length < 1) {
      return toast.show('Password tidak boleh kosong', {type: 'danger'});
    } else if (password !== passwordConfirm) {
      return toast.show('Pastikan password benar', {type: 'danger'});
    }
    setLoading(true);

    const validateReferral = referralCode
      ? Number(referralCode).toString()
      : '';
    const data = {
      businessName,
      email,
      phoneNumber,
      password,
      referralCode: validateReferral,
    };

    // Encrypt
    const encryptText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPT_KEY,
    ).toString();

    axios
      .post(`${API_URL}/register`, {data: encryptText})
      .then(() => {
        setLoading(false);
        visibilityModalSuccess();
      })
      .catch(e => {
        console.log('eee', e);
        setLoading(false);
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
  };

  const visibilityModalSuccess = () => {
    setModalSuccess(!modalSuccess);
  };

  return (
    <ScrollView
      style={styles.shell}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          right: wp(10),
          position: 'absolute',
          marginTop: hp(5),
        }}>
        <Image
          style={{
            width: wp(5),
            height: hp(3),
            alignSelf: 'flex-end',
          }}
          source={require('../../../assets/ic_close.png')}
        />
      </TouchableOpacity>
      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Daftarkan Bisnis</Text>
        <View style={{marginTop: 44, width: '75%'}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_user.png')}
            />
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Onlen.id/Nama bisnis"
              placeholderTextColor="#d4d4d4"
              onChangeText={text => {
                validationBusinessName(text);
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
          {showError && (
            <Text style={{color: '#EE4266', marginTop: 8}}>
              Tidak boleh menggunakan spasi yaaa
            </Text>
          )}
          <View style={{marginTop: 30, flexDirection: 'row'}}>
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
          <View style={{marginTop: 30, flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic-telephone.png')}
            />
            <TextInput
              style={[styles.input]}
              underlineColorAndroid="transparent"
              placeholder="Nomor handphone"
              placeholderTextColor="#d4d4d4"
              returnKeyType="next"
              keyboardType="number-pad"
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

          <View style={{marginTop: 30, flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_password.png')}
            />
            <TextInput
              secureTextEntry={isSecure}
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
              onSubmitEditing={() => {
                this.confirmPassword.focus();
              }}
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
          <View style={{marginTop: 30, flexDirection: 'row'}}>
            <Image
              style={{width: 28, height: 28, marginTop: 10}}
              source={require('../../../assets/ic_password.png')}
            />
            <TextInput
              secureTextEntry={isSecureConfirm}
              style={[styles.input]}
              underlineColorAndroid="transparent"
              placeholder="Konfirmasi password"
              placeholderTextColor="#d4d4d4"
              onChangeText={text => {
                setPasswordConfirm(text);
              }}
              ref={input => {
                this.confirmPassword = input;
              }}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                this.referralCode.focus();
              }}
            />
            <TouchableOpacity onPress={() => securePasswordConfirm()}>
              <Image
                style={{width: 20, height: 20, marginTop: 16}}
                source={
                  isSecureConfirm
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

          <View style={{marginTop: 30, flexDirection: 'row'}}>
            <Image
              style={{width: 24, height: 24, marginTop: 10, marginLeft: 4}}
              source={require('../../../assets/affiliate.png')}
            />
            <TextInput
              style={[styles.input]}
              underlineColorAndroid="transparent"
              placeholder="Kode referral (opsional)"
              placeholderTextColor="#d4d4d4"
              returnKeyType="next"
              keyboardType="number-pad"
              onChangeText={text => {
                setreferralCode(text);
              }}
              ref={input => {
                this.referralCode = input;
              }}
              onSubmitEditing={onSubmitRegis}
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
            disabled={showError}
            style={{
              marginTop: hp(5),
              height: 46,
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: showError ? 'grey' : '#ff3e6c',
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
      <Modal isVisible={modalSuccess} onBackdropPress={visibilityModalSuccess}>
        <View style={styles.modalSuccess}>
          <Text style={styles.textTitle}>Akun berhasil dibuat!</Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: '5%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#ff3366',
                height: hp(4),
                width: wp(20),
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '500', color: 'white'}}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default RegisterScreen;
