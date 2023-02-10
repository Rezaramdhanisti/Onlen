import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
  BackHandler,
  Linking,
} from 'react-native';
import axios from 'axios';
import {API_URL, ADDRESS_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToast} from 'react-native-toast-notifications';
import {useFocusEffect} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

import OneSignal from 'react-native-onesignal';

import styles from './style';

function HomeScreenV2({navigation}) {
  const toast = useToast();
  const [dataProfile, setDataProfile] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        return;
      }),
    [navigation],
  );

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification);
    navigation.navigate('Order');
  });

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
        console.log('eeee', e);
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
  };
  const goToSetting = () => {
    navigation.navigate('Settings', dataProfile);
  };
  const goToPrinter = () => {
    if (dataProfile?.roleName !== 'administrator') {
      return alertPremium();
    }
    navigation.navigate('PrinterSettings');
  };
  const goToOrder = () => {
    // if (!dataProfile?.isPremium) {
    //   return alertPremium2();
    // }
    navigation.navigate('Order');
  };
  const goToReport = () => {
    if (!dataProfile?.isPremium) {
      return alertPremium2();
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(`${ADDRESS_URL}${dataProfile.merchantName}`);
    toast.show('Tersalin', {type: 'success'});
  };

  return (
    <ScrollView
      style={styles.shell}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl onRefresh={getDetailProfile} />}>
      <Text style={styles.textTitleWithEmail}>Beranda</Text>
      <Text style={styles.textWelcome}>
        Selamat datang di Onlen, {dataProfile?.name}
      </Text>
      <TouchableOpacity
        style={styles.containerCardToko}
        onPress={() => navigation.navigate('ShowMenu', dataProfile)}>
        <Text style={styles.textTitleToko}>Toko kamu</Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={styles.textSubtitleShareMenuBold}>
            {ADDRESS_URL}
            {dataProfile.merchantName}
          </Text>
          <TouchableOpacity
            onPress={() => {
              copyToClipboard();
            }}>
            <Image
              style={styles.imageCopy}
              source={require('../../../assets/copy.png')}
            />
          </TouchableOpacity>
        </View>
        <Image
          style={{
            width: 16,
            height: 16,
            position: 'absolute',
            right: 14,
          }}
          source={require('../../../assets/ic_right_arrow.png')}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.textTitle}>Jelajahi lebih banyak fitur</Text>
        <Text style={styles.textSubtitle}>
          Ayo gunakan berbagai fitur untuk mendukung bisnis Anda!
        </Text>
      </View>

      <View style={styles.borderText} />

      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() => navigation.navigate('MyQris')}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/qris.png')}
          />
        </View>
        <View>
          <Text style={styles.textTitle}>QRIS</Text>
          <Text style={styles.textSubtitle}>
            Pembayaran anti ribet dengan QRIS
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />

      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() => navigation.navigate('LandingPage')}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/features.png')}
          />
        </View>
        <View>
          <Text style={styles.textTitle}>Web Page</Text>
          <Text style={styles.textSubtitle}>
            Buat tampilan Web Page khusus untuk bisnis mu!
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />

      <View>
        <Text style={styles.textTitle}>Pusat Bantuan</Text>
        <Text style={styles.textSubtitle}>
          Lihat referensi ini untuk mendapatkan jawaban atas pertanyaan, video,
          dan praktik terbaik Anda.
        </Text>
      </View>

      <View style={styles.borderText} />

      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() => Linking.openURL('https://youtube.com')}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/product.png')}
          />
        </View>
        <View>
          <Text style={styles.textTitle}>Bagaimana menambah produk?</Text>
          <Text style={styles.textSubtitle}>
            Dapatkan panduan langkah demi langkah tentang cara terbaik
            menyiapkan produk Anda.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />

      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() => Linking.openURL('https://youtube.com')}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/features.png')}
          />
        </View>
        <View style={{paddingRight: 20}}>
          <Text style={styles.textTitle}>Bagaimana membuat Web Page?</Text>
          <Text style={styles.textSubtitle}>Tutorial membuat Web page</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />

      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() => Linking.openURL('https://youtube.com')}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/qris.png')}
          />
        </View>
        <View style={{paddingRight: 20}}>
          <Text style={styles.textTitle}>Bagaimana menambah fitur QRIS?</Text>
          <Text style={styles.textSubtitle}>
            Tutorial menambahkan fitur QRIS
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />
      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() =>
          Linking.openURL('https://wa.me/6281380550020?text=Halo')
        }>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/support.png')}
          />
        </View>
        <View style={{paddingRight: 20}}>
          <Text style={styles.textTitle}>Kontak kami</Text>
          <Text style={styles.textSubtitle}>
            Bantuan oleh tim Onlen untuk menjawab semua pertanyaan Anda.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />
      <View style={{height: 100}} />
    </ScrollView>
  );
}

export default HomeScreenV2;
