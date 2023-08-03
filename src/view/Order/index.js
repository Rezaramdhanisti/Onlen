import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Image, Linking} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function OrderScreen({navigation}) {
  const pressLogOut = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
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
            source={require('../../../assets/upload.png')}
          />
          <Text style={styles.textSales}>Bagikan link toko kamu</Text>
        </View>
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
            Linking.openURL('https://wa.me/6285158699516?text=Halo')
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
          onPress={pressLogOut}
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

export default OrderScreen;
