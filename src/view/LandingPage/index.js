import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, ADDRESS_URL} from '@env';
import {useToast} from 'react-native-toast-notifications';
import Clipboard from '@react-native-clipboard/clipboard';
import {useFocusEffect} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function LandingPageScreen({navigation, route}) {
  const [dataLandingPage, setDataLandingPage] = useState([]);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getListTautan();
    }, []),
  );

  const getListTautan = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');

    axios
      .get(`${API_URL}/dashboard/merchant-landing-page-metadata`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        setDataLandingPage(res?.data?.data);
        console.log('res.data.data', res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyToClipboard = () => {
    if (dataLandingPage?.length > 0) {
      Clipboard.setString(`${ADDRESS_URL}${route?.params?.merchantName}`);
      toast.show('Tersalin', {type: 'success'});
    } else {
      toast.show('Tambah tautan terlebih dahulu', {type: 'danger'});
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('LandingDetail', {
          title: item?.title,
          link: item?.value,
          linkId: item?.id,
        })
      }>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: hp(1),
        }}>
        <View>
          <Text style={styles.textSales}>{item?.title}</Text>
          <Text style={styles.textEditCategory}>Edit Tautan</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('LandingDetail', {
              title: item?.title,
              link: item?.value,
              linkId: item?.id,
            })
          }
          style={{
            width: 120,
            height: 50,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            paddingBottom: hp(2),
          }}>
          <Image
            style={{
              width: 16,
              height: 16,
            }}
            source={require('../../../assets/ic_right_arrow.png')}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#E8EBEB',
          marginTop: 14,
          marginBottom: 4,
        }}
      />
    </TouchableOpacity>
  );

  const renderEmptyItem = () => (
    <View>
      <View
        style={{
          alignItems: 'center',
          marginTop: hp(10),
        }}>
        <Image
          style={{
            width: 220,
            height: 220,
            resizeMode: 'contain',
          }}
          source={require('../../../assets/Onboarding-2.png')}
        />
      </View>
      <Text style={styles.textNoData}>Tautan kosong</Text>
    </View>
  );

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

        <Text style={styles.textHeader}>Pengaturan Webpage</Text>
      </View>

      <View style={styles.containerWithEmail}>
        <View style={styles.containerCardToko}>
          <Text style={styles.textTitleToko}>Webpage kamu</Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.textSubtitleShareMenuBold}>
              {ADDRESS_URL}
              {route?.params?.merchantName}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 14,
            }}
            onPress={() => copyToClipboard()}>
            <Image
              style={{
                width: 26,
                height: 26,
              }}
              source={require('../../../assets/copy.png')}
            />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp(20),
            }}>
            <ActivityIndicator size="large" color="#ff3366" />
          </View>
        ) : (
          <FlatList
            data={dataLandingPage}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyItem}
          />
        )}
        {/* <View style={{height: hp(5)}}></View> */}
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
          onPress={() => navigation.navigate('LandingDetail')}>
          <Text style={styles.textAddMenu}>Tambah Tautan Baru</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LandingPageScreen;
