import React, {useCallback, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Linking,
  Platform,
} from 'react-native';
import {ADDRESS_URL} from '@env';
import {useToast} from 'react-native-toast-notifications';
import {CommonActions} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function SettingScreen({navigation, route}) {
  const toast = useToast();
  const [printerName, setPrinterName] = useState('');

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

  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@printer');
      if (value !== null) {
        // value previously stored
        console.log('ada', value);
        setPrinterName(value);
      } else {
        console.log('null', value);
      }
    } catch (e) {
      // error reading value
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(`${ADDRESS_URL}${route.params.merchantName}`);
    toast.show('Tersalin', {type: 'success'});
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
          onPress={() => navigation.navigate('MerchantSetting')}
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

        <TouchableOpacity
          onPress={() => navigation.navigate('PrinterSettings', printerName)}
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

        <View style={{height: hp(4)}}></View>
        <Text style={styles.textTitleWithEmail}>Pegawai</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Employee')}
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
    </View>
  );
}

export default SettingScreen;
