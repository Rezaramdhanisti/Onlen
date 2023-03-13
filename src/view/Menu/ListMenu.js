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

function ListMenuScreen({navigation, route}) {
  const {categoryName, categoryId, allDataCategory} = route.params;
  const [dataMenu, setDataMenu] = useState([]);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      getListMenu();
    }, []),
  );
  const formatNumber = value => {
    // format number 1000000 to 1,234,567
    const text = value.toString();
    return text.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getListMenu = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .get(`${API_URL}/dashboard/menus`, {
        params: {limit: 100, categoryId},
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        setDataMenu(res.data.data);
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
        navigation.navigate('DetailMenu', {allDataCategory, dataMenu: item})
      }>
      <View
        style={{
          flexDirection: 'row',
          marginTop: hp(1),
        }}>
        <Image
          style={{
            width: 80,
            height: 80,
          }}
          source={{uri: item.imageUrl}}
        />
        <View style={{marginLeft: wp(4)}}>
          <Text style={styles.textMenu}>{item.name}</Text>
          <Text style={styles.textDescription}>{item.description}</Text>
          <Text style={styles.textPrice}>Rp {formatNumber(item.price)}</Text>
        </View>

        <Image
          style={{
            width: 16,
            height: 16,
            position: 'absolute',
            right: wp(1),
            top: hp(1),
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
      <Text style={styles.textNoData}>Menu kosong</Text>
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

        <Text style={styles.textHeader}>{categoryName}</Text>
      </View>

      <View style={styles.containerWithEmail}>
        <Text style={styles.textTitleWithEmail}>Daftar Menu</Text>

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
            data={dataMenu}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyItem}
          />
        )}
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
          onPress={() =>
            navigation.navigate('DetailMenu', {
              allDataCategory,
              dataMenu: null,
              categoryId,
            })
          }>
          <Text style={styles.textAddMenu}>Tambah Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ListMenuScreen;
