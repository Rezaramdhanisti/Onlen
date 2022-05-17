import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Image, Linking} from 'react-native';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import {API_URL, ENCRYPT_KEY} from '@env';
import {useToast} from 'react-native-toast-notifications';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function MenuScreen({navigation}) {
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

        <Text style={styles.textHeader}>Menu</Text>
      </View>

      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Daftar Kategori</Text>

        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 14,
            marginBottom: 4,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('ListMenu')}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          <Text style={styles.textSales}>Serba Ayam</Text>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/ic_right_arrow.png')}
          />
        </TouchableOpacity>
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 14,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          <Text style={styles.textSales}>Serba Ayam</Text>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/ic_right_arrow.png')}
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 14,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          <Text style={styles.textSales}>Serba Ayam</Text>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/ic_right_arrow.png')}
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 14,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          <Text style={styles.textSales}>Serba Ayam</Text>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/ic_right_arrow.png')}
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 14,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          <Text style={styles.textSales}>Serba Ayam</Text>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/ic_right_arrow.png')}
          />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 14,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            height: hp(5),
            backgroundColor: '#ff3366',
            borderRadius: 4,
            justifyContent: 'center',
            position: 'absolute',
            bottom: hp(4),
            left: wp(24),
            right: wp(24),
          }}>
          <Text style={styles.textAddMenu}>Tambah</Text>
        </View>
      </View>
    </View>
  );
}

export default MenuScreen;
