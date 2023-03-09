import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
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
import Modal from 'react-native-modal';
import {BluetoothEscposPrinter} from 'tp-react-native-bluetooth-printer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import OneSignal from 'react-native-onesignal';

import styles from './style';

function HomeScreenV2({navigation}) {
  const toast = useToast();
  const [dataProfile, setDataProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [modalErrorPrinter, setModalErrorPrinter] = useState(false);
  const [loadingPrintMenu, setLoadingPrintMenu] = useState(false);

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
    getFirstInstall();
  }, []);

  const getFirstInstall = async () => {
    try {
      const value = await AsyncStorage.getItem('@firstinstall');
      if (value === null) {
        // value previously stored
        setModalProduct(true);
        storeData('true');
      }
    } catch (e) {}
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@firstinstall', value);
    } catch (e) {
      // saving error
    }
  };

  const storeDataProfile = async value => {
    try {
      await AsyncStorage.setItem('@profile', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

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
        storeDataProfile(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
  };

  const _pullToRefresh = async () => {
    const token = await AsyncStorage.getItem('@token');
    setLoading(true);
    axios
      .get(`${API_URL}/dashboard/profiles`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        setDataProfile(res.data.data);
        storeDataProfile(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getMenuProduct = async () => {
    if (loadingPrintMenu) {
      return;
    }

    const token = await AsyncStorage.getItem('@token');
    setLoadingPrintMenu(true);
    axios
      .post(
        `${API_URL}/dashboard/generate-barcode-menu`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(res => {
        console.log('hehehe', res.data.data);
        printMenu(res.data.data.url);
      })
      .catch(e => {
        console.log('err', e?.response?.data.message);
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
    // .finally(() => {
    //   setLoadingPrintMenu(false);
    // });
  };

  const printMenu = async url => {
    try {
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [dataProfile.merchantName],
        {},
      );
      await BluetoothEscposPrinter.printQRCode(
        url,
        340,
        BluetoothEscposPrinter.ERROR_CORRECTION.H,
        10,
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Scan menu di sini'],
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});

      setLoadingPrintMenu(false);
    } catch (e) {
      setLoadingPrintMenu(false);
      setModalErrorPrinter(!modalErrorPrinter);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(`${ADDRESS_URL}${dataProfile.merchantName}/produk`);
  };

  const visibilityModalProduct = () => {
    setModalProduct(!modalProduct);
    navigation.navigate('Produk');
  };

  const visibilityModalErrorPrinter = () => {
    setModalErrorPrinter(!modalErrorPrinter);
    navigation.navigate('Pengaturan');
  };
  return (
    <ScrollView
      style={styles.shell}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl onRefresh={_pullToRefresh} refreshing={loading} />
      }>
      <Text style={styles.textTitleWithEmail}>Beranda</Text>
      <Text style={styles.textWelcome}>
        Selamat datang di Onlen, {dataProfile?.name}
      </Text>
      {dataProfile?.isPremium ? (
        <TouchableOpacity
          style={styles.containerCardPrint}
          onPress={getMenuProduct}>
          {loadingPrintMenu ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text style={styles.textAddMenu}>Print Menu</Text>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 10,
                }}
                source={require('../../../assets/printer-white.png')}
              />
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.containerCardToko}
          onPress={() => navigation.navigate('ShowMenu', dataProfile)}>
          <Text style={styles.textTitleToko}>Produk kamu</Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.textSubtitleShareMenuBold}>
              {ADDRESS_URL}
              {dataProfile.merchantName}/produk
            </Text>
            <TouchableOpacity
              style={{width: 50, height: 26}}
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
      )}

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
        onPress={() => navigation.navigate('LandingPage', dataProfile)}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/features.png')}
          />
        </View>
        <View>
          <Text style={styles.textTitle}>Web page</Text>
          <Text style={styles.textSubtitle}>
            Buat tampilan Web page khusus untuk bisnis mu!
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
        onPress={() => Linking.openURL('https://youtu.be/lBJECI89xoQ')}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/product.png')}
          />
        </View>
        <View>
          <Text style={styles.textTitle}>Bagaimana menambah produk?</Text>
          <Text style={styles.textSubtitle}>
            Dapatkan panduan tentang cara terbaik menyiapkan produk Anda.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />

      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() => Linking.openURL('https://youtu.be/FuTo462IWCQ')}>
        <View style={styles.containerImageFeature}>
          <Image
            style={styles.imageFeature}
            source={require('../../../assets/features.png')}
          />
        </View>
        <View style={{paddingRight: 20}}>
          <Text style={styles.textTitle}>
            Apa itu Web page dan bagaimana membuatnya?
          </Text>
          <Text style={styles.textSubtitle}>
            Panduan apa itu Web page & Tutorial membuat Web page
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.borderText2} />

      <TouchableOpacity
        style={styles.containerFeature}
        onPress={() => Linking.openURL('https://youtu.be/ZmVtZ9kOFhg')}>
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

      <Modal
        isVisible={modalProduct}
        onBackdropPress={visibilityModalProduct}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.modalConfirm}>
          <Image
            style={{
              width: 220,
              height: 220,
            }}
            resizeMode="contain"
            source={require('../../../assets/Onboarding-2.png')}
          />
          <Text style={styles.textTitleModal}>Tambahkan produk Anda</Text>
          <Text style={styles.textSubtitleModal}>
            Untuk bisa memulai toko, ayo tambahkan produknya dulu.
          </Text>

          <TouchableOpacity
            onPress={() => visibilityModalProduct()}
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

      <Modal
        isVisible={modalErrorPrinter}
        onBackdropPress={visibilityModalErrorPrinter}
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
            onPress={() => visibilityModalErrorPrinter()}
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
    </ScrollView>
  );
}

export default HomeScreenV2;
