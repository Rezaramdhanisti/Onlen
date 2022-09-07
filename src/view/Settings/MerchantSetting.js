import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Switch,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useToast} from 'react-native-toast-notifications';
import Modal from 'react-native-modal';
import {API_URL} from '@env';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function MerchantSettingScreen({navigation}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledDineIn, setIsEnabledDineIn] = useState(false);
  const [isEnabledTakeAway, setIsEnabledTakeAway] = useState(false);
  const [isEnabledOnline, setIsEnabledOnline] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSwitchDineIn = () =>
    setIsEnabledDineIn(previousState => !previousState);
  const toggleSwitchTakeAway = () =>
    setIsEnabledTakeAway(previousState => !previousState);
  const toggleSwitchOnline = () =>
    setIsEnabledOnline(previousState => !previousState);
  const [dataMerchant, seDataMerchant] = useState({});
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [textServiceFee, setTextServiceFee] = useState('0');
  const [textTaxFee, setTextTaxFee] = useState('0');
  const [merchantName, setMerchantName] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    getDetailMerchant();
  }, []);

  const getDetailMerchant = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');

    axios
      .get(`${API_URL}/dashboard/merchants`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        const {data} = res.data;
        console.log('data', data);
        seDataMerchant(data);
        setIsEnabledDineIn(data?.isDinein);
        setIsEnabled(data?.isDelivery);
        setIsEnabledTakeAway(data?.isTakeaway);
        setIsEnabledOnline(data?.isOnlineOrder);
        setTextTaxFee(data?.tax ? data?.tax?.toString() : '0');
        setTextServiceFee(
          data?.serviceFee ? data?.serviceFee?.toString() : '0',
        );
        setMerchantName(data?.name ? data?.name.toString() : '');
      })
      .catch(e => {
        console.log('eee', e);
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };
  console.log('haha', dataMerchant.name, merchantName);
  const updateMenu = async () => {
    setLoading(true);
    const dataPayload = {
      name: merchantName,
      address: dataMerchant?.address ? dataMerchant?.address : 'kosong',
      latitude: dataMerchant?.latitude ? dataMerchant?.latitude : 12121212,
      longitude: dataMerchant?.longitude ? dataMerchant?.longitude : 12121212,
      phoneNumber: dataMerchant?.phoneNumber,
      isDinein: isEnabledDineIn,
      isDelivery: isEnabled,
      isTakeaway: isEnabledTakeAway,
      isOnlineOrder: isEnabledOnline,
      tax: textTaxFee ? parseFloat(textTaxFee) : 0,
      serviceFee: textServiceFee ? parseFloat(textServiceFee) : 0,
    };
    const token = await AsyncStorage.getItem('@token');
    console.log('address', dataPayload);
    axios
      .put(`${API_URL}/dashboard/merchants`, dataPayload, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(() => {
        visibilityModalSuccess();
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const visibilityModalSuccess = () => {
    setModalSuccess(!modalSuccess);
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

        <View>
          <Text style={styles.textHeader}>Detail Penjual</Text>
        </View>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#E8EBEB',
          marginTop: 14,
          marginBottom: 4,
        }}
      />
      <ScrollView
        style={styles.containerDetailMenu}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.textTitleWithEmail}>Management Merchant</Text>
        <View style={{height: hp(1)}} />
        <Text style={styles.textSubtitle}>Nama Merchant</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={{color: '#565454', marginTop: 6}}
          placeholderTextColor="#9FA2B4"
          onChangeText={value => setMerchantName(value)}
          value={merchantName}
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
          }}
        />

        <Text style={styles.textSubtitle}>Nomor Handphone Merchant</Text>
        <Text style={styles.textSubtitle2}>{dataMerchant.phoneNumber}</Text>

        <View style={{height: hp(2)}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textToggle}>Online order</Text>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isEnabledOnline ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitchOnline}
            value={isEnabledOnline}
          />
        </View>
        <Text style={styles.textSubtitle2}>
          Bisa order online atau hanya memperlihatkan menu
        </Text>
        <Text style={styles.textSubtitle}>Service fee</Text>

        <TextInput
          underlineColorAndroid="transparent"
          keyboardType="number-pad"
          style={{color: '#565454', marginTop: 6}}
          placeholderTextColor="#9FA2B4"
          onChangeText={value => setTextServiceFee(value)}
          value={textServiceFee}
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
          }}
        />
        <Text style={styles.textSubtitle}>Pajak fee</Text>

        <TextInput
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          style={{color: '#565454', marginTop: 6}}
          placeholderTextColor="#9FA2B4"
          onChangeText={newText => setTextTaxFee(newText)}
          value={textTaxFee}
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
            marginBottom: 4,
          }}
        />
        <View style={{height: hp(2)}} />
        <Text style={styles.textTitleWithEmail}>Service Merchant</Text>

        <View style={{height: hp(2)}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textToggle}>Dine in</Text>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isEnabledDineIn ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitchDineIn}
            value={isEnabledDineIn}
          />
        </View>
        <Text style={styles.textSubtitle2}>Pelanggan makan ditempat</Text>

        <View style={{height: hp(2)}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textToggle}>Take away</Text>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isEnabledTakeAway ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitchTakeAway}
            value={isEnabledTakeAway}
          />
        </View>
        <Text style={styles.textSubtitle2}>Pelanggan minta dibungkus</Text>

        <View style={{height: hp(2)}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textToggle}>Delivery</Text>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isEnabled ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Text style={styles.textSubtitle2}>Pelanggan minta dikirim</Text>

        <View style={{height: hp(15)}} />
      </ScrollView>
      <TouchableOpacity
        style={{
          height: hp(5),
          backgroundColor: '#ff3366',
          borderRadius: 4,
          justifyContent: 'center',
          position: 'absolute',
          bottom: hp(4),
          left: wp(24),
          right: wp(24),
        }}
        onPress={() => {
          updateMenu();
        }}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View>
            <Text style={styles.textAddMenu}>Simpan</Text>
          </View>
        )}
      </TouchableOpacity>
      <Modal isVisible={modalSuccess} onBackdropPress={visibilityModalSuccess}>
        <View style={styles.modalSuccess}>
          <Text style={styles.textTitle}>Berhasil!</Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: '5%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={visibilityModalSuccess}
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
    </View>
  );
}

export default MerchantSettingScreen;
