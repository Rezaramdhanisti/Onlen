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
  const [modalConfirm, setModalConfirm] = useState(false);
  const [isLoadingUpdate, setLoadingUpdate] = useState(false);
  const [tempOrderId, setTempOrderId] = useState('');
  const [dataProfile, setDataProfile] = useState({});
  const [modalFeature, setModalFeature] = useState(false);

  moment.locale('id');
  useFocusEffect(
    useCallback(() => {
      getDataProfile();
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

  const visibilityModalConfirm = orderId => {
    setTempOrderId(orderId);
    setModalConfirm(!modalConfirm);
  };

  const visibilityModalFeature = () => {
    setModalFeature(!modalFeature);
    navigation.navigate('Home');
  };

  const getDataProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('@profile');
      if (value !== null) {
        setDataProfile(JSON.parse(value));
        // value previously stored
        if (!JSON.parse(value).isPremium) {
          setTimeout(() => {
            setModalFeature(true);
          }, 500);
        } else {
          getListOrder();
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  const updateOrder = async () => {
    setLoadingUpdate(!isLoadingUpdate);
    const token = await AsyncStorage.getItem('@token');
    const dataPayload = {
      orderStatus: 'in-progress',
    };
    axios
      .put(`${API_URL}/dashboard/orders/${tempOrderId}/status`, dataPayload, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(() => {
        getListOrder();
        visibilityModalConfirm();
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoadingUpdate(false);
      });
  };

  const getDetailOrder = async orderId => {
    setModalDetail(!modalDetail);
    setLoadingDetail(true);
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

  const renderItem = ({item}) => (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: hp(1),
        }}>
        <TouchableOpacity onPress={() => getDetailOrder(item.id)}>
          <Text style={styles.textSales}>{item?.customerName}</Text>
          <View
            style={{alignItems: 'center', flexDirection: 'row', marginTop: 4}}>
            <Text style={{fontWeight: '500', color: '#565454'}}>
              Order pada
            </Text>
            <Text style={{marginLeft: 4, color: '#565454'}}>
              {moment(item.createdAt).format('h:mm:ss a')}
            </Text>
          </View>
          <Text style={{marginTop: 4, fontWeight: '500', color: '#565454'}}>
            {item.orderType === 'dine_in' ? 'Makan di tempat' : 'di bungkus'}
          </Text>
        </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => visibilityModalConfirm(item.id)}
          style={{
            backgroundColor: '#ff3366',
            height: hp(4),
            width: wp(20),
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: '500', color: 'white'}}>Terima</Text>
        </TouchableOpacity>
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
      <Text style={styles.textNoData}>Pesanan kosong</Text>
    </View>
  );

  const renderItemDetail = item => (
    <View style={{alignItems: 'center', flexDirection: 'row', marginTop: 14}}>
      <View style={{flex: 1}}>
        <Text style={{fontWeight: '500', color: '#A0A2A8'}}>
          {item.item.quantity}x {item.item.productName}
        </Text>
        <Text style={{color: '#A0A2A8'}}>@ {item.item.price}</Text>
        <Text style={{color: '#A0A2A8'}}>Pedas banget</Text>
      </View>

      <View style={{flexDirection: 'row', flex: 1}}>
        <Text style={{marginLeft: 4, color: '#565454'}}>
          {item.item.totalPrice}
        </Text>
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
            <ScrollView showsVerticalScrollIndicator={false}>
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
                <Text style={{fontWeight: '500', flex: 1, color: '#A0A2A8'}}>
                  Nama
                </Text>
                <Text style={{marginLeft: 4, flex: 1, color: '#A0A2A8'}}>
                  {dataOrderDetail?.customerName}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#A0A2A8'}}>
                  Order pada
                </Text>
                <Text style={{marginLeft: 4, flex: 1, color: '#A0A2A8'}}>
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
                <Text style={{fontWeight: '500', flex: 1, color: '#A0A2A8'}}>
                  Pajak
                </Text>
                <Text style={{marginLeft: 4, flex: 1, color: '#A0A2A8'}}>
                  Rp {dataOrderDetail?.taxAmount}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#A0A2A8'}}>
                  Service
                </Text>
                <Text style={{marginLeft: 4, flex: 1, color: '#A0A2A8'}}>
                  Rp {dataOrderDetail?.serviceFee}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 6,
                }}>
                <Text style={{fontWeight: '500', flex: 1, color: '#A0A2A8'}}>
                  Total
                </Text>
                <Text style={{marginLeft: 4, flex: 1, color: '#A0A2A8'}}>
                  Rp {dataOrderDetail?.totalAmount}
                </Text>
              </View>

              <Text
                style={{fontWeight: '500', marginTop: 30, color: '#A0A2A8'}}>
                Order
              </Text>
              <FlatList
                data={dataOrderDetail?.items}
                renderItem={renderItemDetail}
                scrollEnabled={false}
                keyExtractor={item => item.productId}
                showsVerticalScrollIndicator={false}
              />
            </ScrollView>
          )}
        </View>
      </Modal>

      <Modal isVisible={modalConfirm} onBackdropPress={visibilityModalConfirm}>
        <View style={styles.modalConfirm}>
          <Text style={styles.textSales}>Proses orderan ini?</Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 24,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => updateOrder()}
              style={{
                backgroundColor: '#ff3366',
                height: hp(4),
                width: wp(20),
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {isLoadingUpdate ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={{fontWeight: '500', color: 'white'}}>Proses</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => visibilityModalConfirm()}
              style={{
                backgroundColor: '#FFDBD4',
                height: hp(4),
                width: wp(20),
                borderRadius: 16,
                marginLeft: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '500', color: '#ff3366'}}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={modalFeature}
        onBackdropPress={visibilityModalFeature}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.modalFeature}>
          <Image
            style={{
              width: 220,
              height: 220,
            }}
            resizeMode="contain"
            source={require('../../../assets/Onboarding-2.png')}
          />
          <Text style={styles.textTitleModal}>Akan Segera Hadir!</Text>
          <Text style={styles.textSubtitleModal}>
            Kami akan infokan saat fitur ini siap digunakan.
          </Text>

          <TouchableOpacity
            onPress={() => visibilityModalFeature()}
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
    </View>
  );
}

export default OrderTodayScreen;
