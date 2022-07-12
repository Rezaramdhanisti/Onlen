import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
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
import Modal from 'react-native-modal';
import moment from 'moment';
import 'moment/locale/id';

import styles from './style';

function OrderTodayScreen({navigation}) {
  const [dataOrder, setDataOrder] = useState([]);
  const [dataOrderDetail, setDataOrderDetail] = useState(null);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDetail, setLoadingDetail] = useState(true);
  const [modalDetail, setModalDetail] = useState(false);

  moment.locale('id');
  useFocusEffect(
    useCallback(() => {
      getListOrder();
    }, []),
  );

  const getListOrder = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');

    axios
      .get(`${API_URL}/dashboard/orders?orderStatus=pending`, {
        params: {limit: 100},
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        console.log('res', res.data.data);
        setDataOrder(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const visibilityModalDetail = () => {
    setModalDetail(!modalDetail);
  };

  const getDetailOrder = async orderId => {
    setModalDetail(!modalDetail);
    setLoadingDetail(true);
    const token = await AsyncStorage.getItem('@token');
    console.log('token', token);
    axios
      .get(`${API_URL}/dashboard/orders/${orderId}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        setDataOrderDetail(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoadingDetail(false);
      });
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
          <Text style={styles.textSales}>{item?.customerName}</Text>
          <View
            style={{alignItems: 'center', flexDirection: 'row', marginTop: 4}}>
            <Text style={{fontWeight: '500'}}>Order pada</Text>
            <Text style={{marginLeft: 4}}>
              {moment(item.createdAt).format('h:mm:ss a')}
            </Text>
          </View>
          <Text style={{marginTop: 4, fontWeight: '500'}}>
            {item.orderType === 'dine_in' ? 'Makan di tempat' : 'di bungkus'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => getDetailOrder(item.id)}
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
          flexDirection: 'row',
          marginTop: 14,
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#ff3366',
            height: hp(4),
            width: wp(20),
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: '500', color: 'white'}}>Terima</Text>
        </View>
        <View
          style={{
            backgroundColor: '#FFDBD4',
            height: hp(4),
            width: wp(20),
            borderRadius: 16,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: '500', color: '#ff3366'}}>Tolak</Text>
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
    </View>
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
      <Text style={styles.textNoData}>Order kosong</Text>
    </View>
  );

  const renderItemDetail = item => (
    <View style={{alignItems: 'center', flexDirection: 'row', marginTop: 14}}>
      <View style={{flex: 1}}>
        <Text style={{fontWeight: '500'}}>1x Nasi Kuning</Text>
        <Text style={{color: '#A0A2A8'}}>@ 10.000</Text>
        <Text style={{color: '#A0A2A8'}}>Pedas banget</Text>
      </View>

      <View style={{flexDirection: 'row', flex: 1}}>
        <Text style={{marginLeft: 4}}>10.000</Text>
      </View>
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
          data={dataOrder}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={{marginTop: 10}}
          ListEmptyComponent={renderEmptyItem}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getListOrder} />
          }
        />
      )}

      <Modal isVisible={modalDetail} onBackdropPress={visibilityModalDetail}>
        <View
          style={isLoadingDetail ? styles.modalLoading : styles.modalContainer}>
          {isLoadingDetail ? (
            <ActivityIndicator size="large" color="#ff3366" />
          ) : (
            <View>
              <Text style={styles.textSales}>
                Detail Order {dataOrderDetail?.customerName}
              </Text>

              <Text style={{fontWeight: '500', marginTop: 20}}>
                Detail Customer
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 14,
                }}>
                <Text style={{fontWeight: '500', flex: 1}}>Nama</Text>
                <Text style={{marginLeft: 4, flex: 1}}>
                  {dataOrderDetail?.customerName}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1}}>Order pada</Text>
                <Text style={{marginLeft: 4, flex: 1}}>
                  {dataOrderDetail?.createdAt}
                </Text>
              </View>

              <Text style={{fontWeight: '500', marginTop: 30}}>Subtotal</Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 14,
                }}>
                <Text style={{fontWeight: '500', flex: 1}}>Pajak</Text>
                <Text style={{marginLeft: 4, flex: 1}}>
                  Rp {dataOrderDetail?.taxAmount}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1}}>Service</Text>
                <Text style={{marginLeft: 4, flex: 1}}>
                  Rp {dataOrderDetail?.serviceFee}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1}}>Total</Text>
                <Text style={{marginLeft: 4, flex: 1}}>
                  Rp {dataOrderDetail?.totalAmount}
                </Text>
              </View>

              <Text style={{fontWeight: '500', marginTop: 30}}>Order</Text>
              <FlatList
                data={dataOrderDetail?.items}
                renderItem={renderItemDetail}
                keyExtractor={item => item.productId}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

export default OrderTodayScreen;
