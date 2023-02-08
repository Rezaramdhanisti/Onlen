import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
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

function MenuScreen({navigation}) {
  const [dataCategory, setDataCategory] = useState([]);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getListCategory();
    }, []),
  );

  const getListCategory = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');

    axios
      .get(`${API_URL}/dashboard/categories`, {
        params: {limit: 100},
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        setDataCategory(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity    onPress={() =>
      navigation.navigate('ListMenu', {
        categoryName: item?.name,
        categoryId: item?.id,
        allDataCategory: dataCategory,
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
          <Text
            onPress={() =>
              navigation.navigate('ListMenu', {
                categoryName: item?.name,
                categoryId: item?.id,
                allDataCategory: dataCategory,
              })
            }
            style={styles.textSales}>
            {item?.name}
          </Text>
          <Text
            style={styles.textEditCategory}
            onPress={() =>
              navigation.navigate('AddCategory', {
                categoryName: item?.name,
                categoryId: item?.id,
              })
            }>
            Edit Kategori
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ListMenu', {
              categoryName: item?.name,
              categoryId: item?.id,
              allDataCategory: dataCategory,
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
      <Text style={styles.textNoData}>Kategori kosong</Text>
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

        <Text style={styles.textHeader}>Produk</Text>
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
            data={dataCategory}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyItem}
            contentContainerStyle={{ paddingBottom: 120 }}
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
            bottom: hp(10),
            left: wp(24),
            right: wp(24),
          }}
          onPress={() => navigation.navigate('AddCategory')}>
          <Text style={styles.textAddMenu}>Tambah Kategori</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MenuScreen;
