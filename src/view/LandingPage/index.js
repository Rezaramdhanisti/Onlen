import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {useToast} from 'react-native-toast-notifications';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function LandingPageScreen({navigation}) {
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
        console.log('res', res.data.data);
        setDataLandingPage(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('LandingDetail', {
          categoryName: item?.name,
          categoryId: item?.id,
          allDataCategory: dataLandingPage,
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
          <Text style={styles.textEditCategory}>Edit Kategori</Text>
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
            width: 120,
            height: 120,
            resizeMode: 'contain',
          }}
          source={require('../../../assets/default-menu.png')}
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

        <Text style={styles.textHeader}>Welcome Page Setting</Text>
      </View>

      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Buat Tautan</Text>

        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 14,
            marginBottom: 4,
          }}
        />

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
          <Text style={styles.textAddMenu}>Tambah Tautan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LandingPageScreen;
