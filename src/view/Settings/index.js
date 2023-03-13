import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {CommonActions} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function SettingScreen({navigation}) {
  const toast = useToast();
  const [printerName, setPrinterName] = useState('');
  const [modalPermission, setModalPermission] = useState(false);
  const [dataProfile, setDataProfile] = useState({});
  const [modalBlockerFeature, setModalBlockerFeature] = useState(false);

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@token');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } catch (e) {
      // remove error
    }
  };

  _requestLocationPermission = async () => {
    if (Platform.Version > 28) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.navigate('PrinterSettings', printerName);
        } else {
          console.log('Permission Denied.');
          // setModalPermission(true);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.navigate('PrinterSettings', printerName);
        } else {
          console.log('Permission Denied.');
          // setModalPermission(true);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    getDataProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  const getDataProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('@profile');
      if (value !== null) {
        // value previously stored
        setDataProfile(JSON.parse(value));
      }
    } catch (e) {
      // error reading value
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@printer');
      if (value !== null) {
        // value previously stored
        setPrinterName(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  const visibilityModalPermission = () => {
    setModalPermission(!modalPermission);
  };

  const visibilityModalBlockerFeature = () => {
    setModalBlockerFeature(!modalBlockerFeature);
  };

  const navigateSetting = () => {
    if (dataProfile?.roleName === 'cashier') {
      setModalBlockerFeature(!modalBlockerFeature);
    } else {
      navigation.navigate('MerchantSetting');
    }
  };

  const navigateEmployee = () => {
    if (dataProfile?.roleName === 'cashier') {
      setModalBlockerFeature(!modalBlockerFeature);
    } else {
      navigation.navigate('Employee');
    }
  };

  return (
    <View style={styles.shell}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: wp(5),
          alignItems: 'center',
        }}>
        <Text style={styles.textHeader}>Pengaturan</Text>
      </View>

      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Informasi Toko</Text>
        <TouchableOpacity
          onPress={navigateSetting}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2),
          }}>
          <Image
            style={{
              width: 16,
              height: 16,
              marginRight: 10,
            }}
            source={require('../../../assets/settings.png')}
          />
          <Text style={styles.textSales}>Pengaturan Toko</Text>
        </TouchableOpacity>

        {dataProfile?.isPremium && (
          <TouchableOpacity
            onPress={_requestLocationPermission}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp(2),
            }}>
            <Image
              style={{
                width: 16,
                height: 16,
                marginRight: 10,
              }}
              source={require('../../../assets/printer.png')}
            />
            <Text style={styles.textSales}>Pengaturan Printer</Text>
          </TouchableOpacity>
        )}
        <View style={{height: hp(4)}}></View>
        <Text style={styles.textTitleWithEmail}>Pegawai</Text>
        <TouchableOpacity
          onPress={navigateEmployee}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2),
          }}>
          <Image
            style={{
              width: 16,
              height: 16,
              marginRight: 10,
            }}
            source={require('../../../assets/employees.png')}
          />
          <Text style={styles.textSales}>Pengaturan pegawai</Text>
        </TouchableOpacity>

        <View style={{height: hp(4)}}></View>
        <Text style={styles.textTitleWithEmail}>Bantuan</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://wa.me/6281380550020?text=Halo')
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2),
          }}>
          <Image
            style={{
              width: 16,
              height: 16,
              marginRight: 10,
            }}
            source={require('../../../assets/support.png')}
          />
          <Text style={styles.textSales}>Kontak kami</Text>
        </TouchableOpacity>

        <View style={{height: hp(4)}}></View>
        <TouchableOpacity
          onPress={removeValue}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2),
          }}>
          <Image
            style={{
              width: 16,
              height: 16,
              marginRight: 10,
            }}
            source={require('../../../assets/log-out.png')}
          />
          <Text style={styles.textSales}>Keluar</Text>
        </TouchableOpacity>
        <View style={{height: hp(4)}}></View>
      </View>
      <Modal
        isVisible={modalPermission}
        onBackdropPress={visibilityModalPermission}>
        <View style={styles.modalPermission}>
          <Text style={styles.textTitlePermission}>Akses Lokasi</Text>
          <Text style={styles.textSubTitlePermission}>
            Membutuhkan akses lokasi untuk menggunakan printer, berikan akses
            lokasi di setting handphone Anda
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: '5%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={visibilityModalPermission}
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

      <Modal
        isVisible={modalBlockerFeature}
        onBackdropPress={visibilityModalBlockerFeature}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.modalFeature}>
          <Image
            style={{
              width: 220,
              height: 220,
            }}
            resizeMode="contain"
            source={require('../../../assets/error-default.png')}
          />
          <Text style={styles.textTitleModal}>Belum terhubung!</Text>
          <Text style={styles.textSubtitleModal}>
            Pastikan sudah ada hubungan dengan printer ya
          </Text>

          <TouchableOpacity
            onPress={() => visibilityModalBlockerFeature()}
            style={{
              backgroundColor: '#ff3366',
              height: hp(5),
              width: '50%',
              alignSelf: 'center',
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 24,
            }}>
            <Text style={{fontWeight: '500', color: 'white'}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default SettingScreen;
