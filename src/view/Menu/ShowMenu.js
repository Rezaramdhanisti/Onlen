import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import {ADDRESS_URL} from '@env';
import {useToast} from 'react-native-toast-notifications';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function ShowMenuScreen({navigation, route}) {
  const toast = useToast();

  const copyToClipboard = () => {
    Clipboard.setString(`${ADDRESS_URL}${dataProfile.merchantName}/produk`);
    toast.show('Tersalin', {type: 'success'});
  };

  const shareToWhatsapp = () => {
    const shareOptions = {
      title: 'Share via',
      message:
        'Halo kastemer! silahkan buka link dibawah ini untuk melihat menu dan order ya!',
      url: `${ADDRESS_URL}${route.params.merchantName}/produk`,
      social: Share.Social.WHATSAPP,
    };

    Share.shareSingle(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
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

        <Text style={styles.textHeader}>Bagikan Toko</Text>
      </View>

      <View
        style={{
          paddingHorizontal: wp(5),
          justifyContent: 'center',
          paddingTop: 100,
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <QRCode
            value={`${ADDRESS_URL}${route.params.merchantName}`}
            size={200}
          />
        </View>

        <Text style={styles.textTitleShareMenu}>Bagikan QR toko kamu yuk!</Text>
        <Text style={styles.textSubtitleShareMenu}>
          Kasih liat QR toko ini ke customer kamu, tanpa repot repot atau bisa
          kasih customer link ini.
        </Text>
        <Text style={styles.textSubtitleShareMenuBold}>
          {ADDRESS_URL}
          {route.params.merchantName}
        </Text>
        <TouchableOpacity
          style={{
            height: hp(6),
            backgroundColor: '#ff3366',
            borderRadius: 50,
            justifyContent: 'center',
            marginTop: hp(6),
            width: wp(88),
          }}
          onPress={() => {
            shareToWhatsapp();
          }}>
          <View>
            <Text style={styles.textAddMenu}>Bagikan Sekarang</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ShowMenuScreen;
