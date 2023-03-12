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
import {formatCurrency} from 'react-native-format-currency';

import styles from './style';

function OrderFinishScreen({navigation}) {
  const [dataOrder, setDataOrder] = useState([]);
  const [dataOrderDetail, setDataOrderDetail] = useState(null);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDetail, setLoadingDetail] = useState(true);
  const [modalDetail, setModalDetail] = useState(false);
  const [tempGroupId, setTempGroupId] = useState('');
  const [tempOrderType, setTempOrderType] = useState('');

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
      .get(`${API_URL}/dashboard/orders?orderStatus=finished`, {
        params: {limit: 100, groupByCode: 1},
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
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

  const getDetailOrder = async (orderId, groupId, orderType) => {
    setLoadingDetail(true);
    setTempGroupId(groupId);
    setTempOrderType(orderType);
    setModalDetail(!modalDetail);
    const token = await AsyncStorage.getItem('@token');
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
  const renderItem = ({item}) => {
    const [valueFormattedWithSymbol] = formatCurrency({
      amount: Number(item.totalAmount),
      code: 'IDR',
    });

    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            getDetailOrder(item?.id, item?.orderGroupCode, item?.orderType)
          }
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(1),
          }}>
          <TouchableOpacity
            onPress={() =>
              getDetailOrder(item?.id, item?.orderGroupCode, item?.orderType)
            }>
            <Text style={styles.textSales}>{item?.customerName}</Text>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 4,
              }}>
              <Text style={{color: '#565454'}}>Nomor Transaksi</Text>
              <Text
                style={{marginLeft: 4, color: '#565454', fontWeight: '500'}}>
                {item?.orderGroupCode}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 4,
              }}>
              <Text style={{color: '#565454'}}>Status</Text>
              <Text
                style={{marginLeft: 4, color: '#565454', fontWeight: '500'}}>
                Selesai
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 4,
              }}>
              <Text style={{color: '#565454'}}>Order pada</Text>
              <Text
                style={{marginLeft: 4, color: '#565454', fontWeight: '500'}}>
                {moment(item.createdAt).format('Do MMMM, h:mm a')}
              </Text>
            </View>
            <Text style={{marginTop: 4, fontWeight: '500', color: '#565454'}}>
              {item.orderType === 'dine_in' ? 'Makan di tempat' : 'di bungkus'}{' '}
            </Text>
            <Text style={{marginTop: 4, fontWeight: '500', color: '#565454'}}>
              Total - {valueFormattedWithSymbol}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              getDetailOrder(item?.id, item?.orderGroupCode, item?.orderType)
            }
            style={{
              width: 100,
              height: 50,
              position: 'absolute',
              right: -80,
              bottom: 0,
            }}>
            <Image
              style={{
                width: 16,
                height: 16,
              }}
              source={require('../../../assets/ic_right_arrow.png')}
            />
          </TouchableOpacity>
        </TouchableOpacity>
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
  };

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
      <Text style={styles.textNoData}>Pesanan kosong</Text>
    </View>
  );

  const renderItemDetail = item => {
    return (
      <View style={{alignItems: 'center', flexDirection: 'row', marginTop: 14}}>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: '500', color: '#565454'}}>
            {item?.item?.quantity}x {item?.item?.productName}
          </Text>
          <Text style={{color: '#565454'}}>
            @ {convertToRupiah(item?.item?.price)}
          </Text>
          {item?.item?.notes && (
            <Text style={{color: '#565454'}}>{item?.item?.notes}</Text>
          )}
        </View>

        <View style={{flexDirection: 'row', flex: 1}}>
          <Text style={{marginLeft: 44, color: '#565454', fontWeight: 'bold'}}>
            {convertToRupiah(item?.item?.totalPrice)}
          </Text>
        </View>
      </View>
    );
  };
  const convertToRupiah = text => {
    const valueText = text ? text : '0';
    return (
      `${'Rp'}` +
      valueText
        .toString()
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    );
  };

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
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.textSales}>
                Nomor Transaksi {tempGroupId}
              </Text>
              <TouchableOpacity
                onPress={() => visibilityModalDetail()}
                style={{
                  right: wp(2),
                  position: 'absolute',
                  marginTop: 0,
                }}>
                <Image
                  style={{
                    width: wp(5),
                    height: hp(3),
                    alignSelf: 'flex-end',
                    tintColor: '#565454',
                  }}
                  source={require('../../../assets/ic_close.png')}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontWeight: '500',
                  marginTop: 20,
                  color: '#565454',
                  fontSize: 16,
                }}>
                Detail Customer
              </Text>
              <View
                style={{
                  marginTop: 14,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#565454'}}>
                  Nama Customer
                </Text>
                <Text style={{flex: 1, color: '#565454'}}>
                  {dataOrderDetail?.customerName}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#565454'}}>
                  Order pada
                </Text>
                <Text style={{flex: 1, color: '#565454'}}>
                  {moment(dataOrderDetail?.createdAt).format('Do MMMM, h:mm a')}
                </Text>
              </View>

              <Text
                style={{
                  fontWeight: '500',
                  marginTop: 30,
                  color: '#565454',
                  fontSize: 16,
                }}>
                Order -{' '}
                {tempOrderType === 'dine_in' ? 'Makan di tempat' : 'di bungkus'}
              </Text>
              <FlatList
                data={dataOrderDetail?.items}
                renderItem={renderItemDetail}
                scrollEnabled={false}
                keyExtractor={(item, index) => item.key}
                showsVerticalScrollIndicator={false}
              />

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 14,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#565454'}}>
                  Pajak
                </Text>
                <Text style={{marginLeft: 88, flex: 1, color: '#565454'}}>
                  {convertToRupiah(dataOrderDetail?.taxAmount)}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#565454'}}>
                  Service
                </Text>
                <Text style={{marginLeft: 88, flex: 1, color: '#565454'}}>
                  {convertToRupiah(dataOrderDetail?.serviceFee)}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#565454'}}>
                  Total
                </Text>
                <Text
                  style={{
                    marginLeft: 88,
                    flex: 1,
                    color: '#565454',
                    fontWeight: 'bold',
                  }}>
                  {convertToRupiah(dataOrderDetail?.totalAmount)}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

export default OrderFinishScreen;
