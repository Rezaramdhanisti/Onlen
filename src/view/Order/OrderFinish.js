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

function OrderFinishScreen({navigation}) {
  const [dataCategory, setDataCategory] = useState([{name: 'reza', id: '1'}]);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

  // useFocusEffect(
  //   useCallback(() => {
  //     getListCategory();
  //   }, []),
  // );

  const getListCategory = async () => {
    // setLoading(true);
    // const token = await AsyncStorage.getItem('@token');
    // axios
    //   .get(`${API_URL}/dashboard/categories`, {
    //     params: {limit: 100},
    //     headers: {
    //       Authorization: 'Bearer ' + token,
    //     },
    //   })
    //   .then(res => {
    //     setDataCategory(res.data.data);
    //   })
    //   .catch(e => {
    //     toast.show(e?.response?.data.message, {type: 'danger'});
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  const renderItem = ({item}) => (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: hp(1),
        }}>
        <View>
          <Text style={styles.textSales}>{item?.name}</Text>
          <View
            style={{alignItems: 'center', flexDirection: 'row', marginTop: 4}}>
            <Text style={{fontWeight: '500'}}>Order pada</Text>
            <Text style={{marginLeft: 4}}>17:30 Rabu, 30 Januari</Text>
          </View>
          <Text style={{marginTop: 4, fontWeight: '500'}}>Makan di tempat</Text>
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
            width: 100,
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
    </View>
  );

  return (
    <View style={styles.containerWithEmail}>
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
          style={{marginTop: 10}}
        />
      )}
    </View>
  );
}

export default OrderFinishScreen;
