import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToast} from 'react-native-toast-notifications';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function HomeScreen({navigation}) {
  const toast = useToast();
  const [dataProfile, setDataProfile] = useState({});

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        return;
      }),
    [navigation],
  );

  useEffect(() => {
    getDetailProfile();
  }, []);

  const getDetailProfile = async () => {
    const token = await AsyncStorage.getItem('@token');
    axios
      .get(`${API_URL}/dashboard/profiles`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        setDataProfile(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
  };

  const alertPremium = () =>
    Alert.alert('Perhatian', 'Hanya admin yang dapat mengakses fitur ini', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  const alertPremium2 = () =>
    Alert.alert('Perhatian', 'Aktifkan premium untuk mengakses fitur ini', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  const goToPeople = () => {
    if (dataProfile?.roleName !== 'administrator') {
      return alertPremium();
    }
    navigation.navigate('Settings');
  };
  const goToSetting = () => {
    if (dataProfile?.roleName !== 'administrator') {
      return alertPremium();
    }
    navigation.navigate('Settings');
  };
  const goToPromotion = () => {
    if (dataProfile?.roleName !== 'administrator') {
      return alertPremium();
    }
    navigation.navigate('Settings');
  };
  const goToOrder = () => {
    if (!dataProfile?.isPremium) {
      return alertPremium2();
    }
    navigation.navigate('Order');
  };
  const goToReport = () => {
    if (!dataProfile?.isPremium) {
      return alertPremium2();
    }
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.shell}>
      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>
          Selamat Datang, {dataProfile?.name}
        </Text>
        <Text style={styles.textSales}> {dataProfile?.roleName}</Text>
        {/* <View style={styles.containerSales}>
          <Image
            style={{width: 14, height: 14, marginLeft: 6, marginRight: 4}}
            source={require('../../../assets/wallet.png')}
          />
          <Text style={styles.textCurrency}>Rp</Text>
          <Text style={styles.textSalesValue}>10,000.00</Text>
        </View> */}

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
            <TouchableOpacity
              onPress={() => goToOrder()}
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
            </TouchableOpacity>
            <Text style={styles.textMenu}>Pesanan</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => goToReport()}
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
            </TouchableOpacity>
            <Text style={styles.textMenu}>Laporan</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Menu')}
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
            </TouchableOpacity>
            <Text style={styles.textMenu}>Menu</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Employee')}
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
            </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => goToSetting()}
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
            </TouchableOpacity>
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
            source={require('../../../assets/banner-1.jpg')}></Image>
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
            source={require('../../../assets/banner-2.jpg')}></Image>
          <Image
            style={{
              width: wp(70),
              height: hp(14),
              flexDirection: 'row',
              paddingHorizontal: 6,
              paddingVertical: 22,
              borderRadius: 12,
            }}
            source={require('../../../assets/banner-3.jpg')}></Image>
        </ScrollView>
      </View>
    </View>
  );
}

export default HomeScreen;
