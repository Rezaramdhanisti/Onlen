import React from 'react';
import {View, TouchableOpacity, Text, Image, Linking} from 'react-native';
import {ADDRESS_URL} from '@env';
import {useToast} from 'react-native-toast-notifications';
import {CommonActions} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function SettingScreen({navigation, route}) {
  const toast = useToast();

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
      console.log('error', e);
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{width: 40}}>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/back.png')}
          />
        </TouchableOpacity>

        <Text style={styles.textHeader}>Pengaturan</Text>
      </View>

      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Link Toko</Text>

        <TouchableOpacity
          onPress={() => copyToClipboard()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2),
          }}>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/upload.png')}
          />
          <Text style={styles.textSales}>Bagikan link toko kamu</Text>
        </TouchableOpacity>
        <View style={{height: hp(4)}}></View>
        <Text style={styles.textTitleWithEmail}>Informasi Toko</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2),
          }}>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/settings.png')}
          />
          <Text style={styles.textSales}>Pengaturan toko</Text>
        </View>

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
