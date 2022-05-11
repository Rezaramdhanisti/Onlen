import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import {API_URL, ENCRYPT_KEY} from '@env';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function LoginScreen({navigation}) {
  const [email, setUsernameText] = useState('');
  const [password, setPasswordText] = useState('');

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
        console.log('error', e?.response?.data.message);
      });
  };

  return (
    <View style={styles.shell}>
      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>
          Selamat Datang, Rumah Depok
        </Text>
        <Text style={styles.textSales}>Jumlah Pesanan Hari Ini</Text>
        <View style={styles.containerSales}>
          <Image
            style={{width: 14, height: 14, marginLeft: 6, marginRight: 4}}
            source={require('../../../assets/wallet.png')}
          />
          <Text style={styles.textCurrency}>Rp</Text>
          <Text style={styles.textSalesValue}>10,000.00</Text>
        </View>

        <ImageBackground
          style={{
            width: wp(90),
            height: hp(14),
            flexDirection: 'row',
            paddingHorizontal: 6,
            paddingVertical: 22,
            marginTop: hp(3),
          }}
          imageStyle={{borderRadius: 12}}
          source={require('../../../assets/background-gradient.png')}>
          <Image
            style={{
              width: 26,
              height: 26,
              marginLeft: 20,
              marginRight: 4,
              alignSelf: 'center',
            }}
            source={require('../../../assets/wallet-white.png')}
          />
          <View style={{marginLeft: 14}}>
            <Text style={styles.textTotalSales}>Total Penjualan Hari Ini</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 6,
                alignItems: 'center',
              }}>
              <Text style={styles.textCurrencyWhite}>Rp</Text>
              <Text style={styles.textSalesValueWhite}>10,000,000.00</Text>
            </View>
          </View>
        </ImageBackground>
        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(3),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
          }}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E8EBEB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  alignSelf: 'center',
                }}
                source={require('../../../assets/shopping-bag.png')}
              />
            </View>
            <Text style={styles.textMenu}>Pesanan</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E8EBEB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 23,
                  height: 23,
                  alignSelf: 'center',
                }}
                source={require('../../../assets/report.png')}
              />
            </View>
            <Text style={styles.textMenu}>Laporan</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E8EBEB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 23,
                  height: 23,
                  alignSelf: 'center',
                }}
                source={require('../../../assets/open-book.png')}
              />
            </View>
            <Text style={styles.textMenu}>Menu</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E8EBEB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 23,
                  height: 23,
                  alignSelf: 'center',
                }}
                source={require('../../../assets/employees.png')}
              />
            </View>
            <Text style={styles.textMenu}>Pegawai</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(3),
            paddingHorizontal: wp(2),
          }}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E8EBEB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 23,
                  height: 23,
                  alignSelf: 'center',
                }}
                source={require('../../../assets/promotion.png')}
              />
            </View>
            <Text style={styles.textMenu}>Promosi</Text>
          </View>
          <View style={{alignItems: 'center', marginLeft: wp(7.2)}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#E8EBEB',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 23,
                  height: 23,
                  alignSelf: 'center',
                }}
                source={require('../../../assets/settings.png')}
              />
            </View>
            <Text style={styles.textMenu}>Pengaturan</Text>
          </View>
        </View>
        <Text style={styles.textTitleInfo}>Info terbaru buat Kamu</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: hp(2),
          }}>
          <Image
            style={{
              width: wp(70),
              height: hp(14),
              flexDirection: 'row',
              paddingHorizontal: 6,
              paddingVertical: 22,
              borderRadius: 12,
              marginRight: wp(3),
            }}
            source={require('../../../assets/background-gradient.png')}></Image>
          <Image
            style={{
              width: wp(70),
              height: hp(14),
              flexDirection: 'row',
              paddingHorizontal: 6,
              paddingVertical: 22,
              borderRadius: 12,
              marginRight: wp(3),
            }}
            source={require('../../../assets/background-gradient.png')}></Image>
          <Image
            style={{
              width: wp(70),
              height: hp(14),
              flexDirection: 'row',
              paddingHorizontal: 6,
              paddingVertical: 22,
              borderRadius: 12,
            }}
            source={require('../../../assets/background-gradient.png')}></Image>
        </ScrollView>
      </View>
    </View>
  );
}

export default LoginScreen;
