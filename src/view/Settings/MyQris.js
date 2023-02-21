import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {launchImageLibrary} from 'react-native-image-picker';
import {useToast} from 'react-native-toast-notifications';
import mime from 'mime';
import {API_URL} from '@env';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function MyQrisScreen({navigation}) {
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [imageMenu, setImageMenu] = useState(null);
  const [imageQRIS, setImageQRIS] = useState(null);
  const [isLoadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    getDataQRIS();
  }, []);

  const getDataQRIS = async () => {
    const token = await AsyncStorage.getItem('@token');
    axios
      .get(`${API_URL}/dashboard/merchants/qris`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        // setImageQRIS(res?.data?.data?.QRISImageURL);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      });
  };

  const createQRIS = async () => {
    setLoading(true);

    const dataPayload = {
      imageUrl: imageMenu,
    };
    const token = await AsyncStorage.getItem('@token');
    axios
      .put(`${API_URL}/dashboard/merchants/qris`, dataPayload, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        Alert.alert('Sukses', 'QRIS berhasil disimpan!', [
          {
            text: 'OK',
            onPress: () => setImageQRIS(res?.data?.data?.QRISImageURL),
          },
        ]);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const changeQRIS = async () => {
    setImageQRIS(null);
    pickImage();
  };

  const pickImage = async (
    options = {
      mediaType: 'photo',
    },
  ) => {
    setLoadingImage(true);
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        setLoadingImage(false);
      } else if (response.errorCode) {
        setLoadingImage(false);
      } else {
        take(response.assets[0].uri);
      }
    });
  };
  const take = async imageCache => {
    const token = await AsyncStorage.getItem('@token');

    var formData = new FormData();
    // formData.append('image', imageCache);
    formData.append('image', {
      uri: imageCache,
      type: mime.getType(imageCache),
      name: `signature-${Date.now()}`,
    });

    axios({
      url: `${API_URL}/dashboard/upload/image`,
      method: 'POST',
      data: formData,
      transformRequest: () => {
        return formData;
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(resp => {
        setImageMenu(resp.data.data.imageURL);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoadingImage(false);
      });
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
          <Text style={styles.textHeader}>My QRIS</Text>
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
        {imageQRIS ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                padding: 14,
                backgroundColor: 'white',
                marginTop: hp(15),
                borderRadius: 8,
              }}>
              <Image
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: 8,
                }}
                resizeMode={'cover'}
                source={{
                  uri: imageQRIS,
                }}
              />
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.textTitleWithEmail}>Upload QRIS</Text>
            <Text style={styles.textSubtitle2}>Upload barcode QRIS kamu.</Text>

            {imageMenu && !isLoadingImage ? (
              <View>
                <Image
                  style={{
                    width: wp(21),
                    height: hp(10),
                    borderRadius: 8,
                    marginTop: hp(1.5),
                  }}
                  resizeMode={'contain'}
                  source={{uri: imageMenu}}
                />
                <Text style={styles.textEditImage} onPress={() => pickImage()}>
                  Ubah Gambar
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => pickImage()}
                style={{
                  width: wp(41),
                  height: hp(20),
                  borderRadius: 8,
                  borderWidth: 1,
                  justifyContent: 'center',
                  marginTop: hp(15),
                  borderColor: '#9FA2B4',
                  alignSelf: 'center',
                }}>
                {isLoadingImage ? (
                  <ActivityIndicator size="small" color="#ff3366" />
                ) : (
                  <Image
                    style={{
                      width: 16,
                      height: 16,
                      alignSelf: 'center',
                    }}
                    source={require('../../../assets/upload.png')}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
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
          {
            imageQRIS ? changeQRIS() : createQRIS();
          }
        }}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View>
            <Text style={styles.textAddMenu}>
              {imageQRIS ? 'Ubah QRIS' : 'Simpan QRIS'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default MyQrisScreen;
