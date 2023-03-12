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
import {BluetoothEscposPrinter} from 'tp-react-native-bluetooth-printer';

import styles from './style';

function OrderProcessScreen({navigation}) {
  const [dataOrder, setDataOrder] = useState([]);
  const [dataOrderDetail, setDataOrderDetail] = useState(null);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingDetail, setLoadingDetail] = useState(true);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [isLoadingUpdate, setLoadingUpdate] = useState(false);
  const [tempOrderId, setTempOrderId] = useState('');
  const [tempGroupId, setTempGroupId] = useState('');
  const [tempOrderType, setTempOrderType] = useState('');
  const [modalErrorPrinter, setModalErrorPrinter] = useState(false);

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
      .get(`${API_URL}/dashboard/orders?orderStatus=in-progress`, {
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

  const visibilityModalConfirm = orderId => {
    setTempOrderId(orderId);
    setModalConfirm(!modalConfirm);
  };

  const updateOrder = async () => {
    setLoadingUpdate(!isLoadingUpdate);
    const token = await AsyncStorage.getItem('@token');
    const dataPayload = {
      orderStatus: 'finished',
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

  function sumArray(array) {
    let sum = 0;

    array.forEach(item => {
      sum += item.quantity;
    });

    return sum;
  }

  const printBillItem = async (productName, quantity, price, totalPrice) => {
    let columnWidths = [14, 5, 13];
    try {
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          productName.toString(),
          quantity.toString(),
          convertToRupiah(totalPrice),
        ],
        {},
      );
    } catch (error) {
      alert(error.message || 'ERROR');
    }
  };
  const printBill = async () => {
    try {
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      );
      await BluetoothEscposPrinter.printText(
        `Nama: ${dataOrderDetail.customerName}\n\r`,
        {},
      );
      await BluetoothEscposPrinter.printText(
        `Jam Order: ${moment(dataOrderDetail?.createdAt).format(
          'Do MMMM, h:mm a',
        )}\n\r`,
        {},
      );
      await BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );
      let columnWidths = [13, 7, 12];
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Pesanan', 'Jumlah', 'Harga'],
        {},
      );

      await BluetoothEscposPrinter.printText('\n\r', {});
      dataOrderDetail.items.map(item =>
        printBillItem(
          item.productName,
          item.quantity,
          item.price,
          item.totalPrice,
        ),
      );
      await BluetoothEscposPrinter.printText('\n\r', {});
      await BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );
      BluetoothEscposPrinter.printColumn(
        [10, 4, 4, 14],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Service', '', '', convertToRupiah(dataOrderDetail.serviceFee)],
        {},
      );
      BluetoothEscposPrinter.printColumn(
        [10, 4, 4, 14],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Pajak', '', '', convertToRupiah(dataOrderDetail.taxAmount)],
        {},
      );

      await BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [13, 7, 12],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          'Total',
          sumArray(dataOrderDetail.items).toString(),
          convertToRupiah(dataOrderDetail.totalAmount),
        ],
        {},
      );
      await BluetoothEscposPrinter.printText('\n\r', {});
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printText('Terima kasih!\n\r\n\r\n\r', {});
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      );
    } catch (e) {
      setModalErrorPrinter(!modalErrorPrinter);
    }
  };

  const visibilityModalErrorPrinter = () => {
    setModalErrorPrinter(!modalErrorPrinter);
    setModalDetail(!modalDetail);
    navigation.navigate('Pengaturan');
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
        console.log('detail', res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  };

  const renderItemV2 = ({item}) => {
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
            flex: 1,
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
                Sedang di proses
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
            <Text style={{fontWeight: '500', color: 'white'}}>Selesai</Text>
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
          renderItem={renderItemV2}
          keyExtractor={(item, index) => item.key}
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
              <TouchableOpacity
                onPress={() => printBill()}
                style={{
                  backgroundColor: '#ff3366',
                  height: hp(4),
                  width: wp(28),
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 22,
                }}>
                <Text style={{fontWeight: '500', color: 'white'}}>
                  Cetak struk
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      <Modal isVisible={modalConfirm} onBackdropPress={visibilityModalConfirm}>
        <View style={styles.modalConfirm}>
          <Text style={styles.textSales}>Selesaikan orderan ini?</Text>

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
                <Text style={{fontWeight: '500', color: 'white'}}>Selesai</Text>
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
    </View>
  );
}

export default OrderProcessScreen;
