import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Switch,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';

import {launchImageLibrary} from 'react-native-image-picker';
import {useToast} from 'react-native-toast-notifications';
import mime from 'mime';
import {API_URL} from '@env';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CurrencyInput from 'react-native-currency-input';

import styles from './style';

function DetailMenuScreen({navigation, route}) {
  const [isEnabled, setIsEnabled] = useState(
    route.params.dataMenu ? route.params.dataMenu?.isSold : false,
  );
  const [isDelete, setIsDelete] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSwitchDelete = () => setIsDelete(previousState => !previousState);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    route.params.dataMenu ? route.params.dataMenu?.category?.id : null,
  );
  const [items, setItems] = useState(route.params.allDataCategory);
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [textName, setTextName] = useState(
    route.params.dataMenu ? route.params.dataMenu?.name : '',
  );
  const [textDescription, setTextDescription] = useState(
    route.params.dataMenu ? route.params.dataMenu?.description : '',
  );
  const [textPrice, setTextPrice] = useState(
    route.params.dataMenu ? route.params.dataMenu?.price?.toString() : '',
  );

  const [imageMenu, setImageMenu] = useState(
    route.params.dataMenu ? route.params.dataMenu?.imageUrl : '',
  );

  const [isLoadingImage, setLoadingImage] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const createMenu = async () => {
    const dataPayload = {
      categoryId: value,
      name: textName,
      imageUrl: imageMenu
        ? imageMenu
        : 'https://kanmakan-images.s3.ap-southeast-1.amazonaws.com/default-menu.png',
      description: textDescription,
      isPromoEnabled: false,
      actualPrice: parseInt(textPrice),
      price: parseInt(textPrice),
      isSold: isEnabled,
    };
    if (textName.length < 1) {
      return toast.show('Isi dulu namanya yaa', {type: 'danger'});
    }
    if (textDescription.length < 1) {
      return toast.show('Isi dulu deskripsinya yaa', {type: 'danger'});
    }
    if (textPrice.length < 1) {
      return toast.show('Isi dulu harganya yaa', {type: 'danger'});
    }
    if (value === null) {
      return toast.show('Isi dulu kategorinya yaa', {type: 'danger'});
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .post(`${API_URL}/dashboard/menus`, dataPayload, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(() => {
        visibilityModalSuccess();
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const visibilityModalSuccess = () => {
    setModalSuccess(!modalSuccess);
  };

  const updateMenu = async () => {
    const dataPayload = {
      categoryId: value,
      name: textName,
      imageUrl: imageMenu
        ? imageMenu
        : 'https://kanmakan-images.s3.ap-southeast-1.amazonaws.com/default-menu.png',
      description: textDescription,
      isPromoEnabled: false,
      actualPrice: parseInt(textPrice),
      price: parseInt(textPrice),
      isSold: isEnabled,
    };

    if (textName.length < 1) {
      return toast.show('Isi dulu namanya yaa', {type: 'danger'});
    }
    if (textDescription.length < 1) {
      return toast.show('Isi dulu deskripsinya yaa', {type: 'danger'});
    }
    if (textPrice.length < 1) {
      return toast.show('Isi dulu harganya yaa', {type: 'danger'});
    }
    if (value === null) {
      return toast.show('Isi dulu kategorinya yaa', {type: 'danger'});
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .put(
        `${API_URL}/dashboard/menus/${route.params.dataMenu?.id}`,
        dataPayload,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(() => {
        visibilityModalSuccess();
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
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
          <Text style={styles.textHeader}>Buat menu</Text>
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
        <Text style={styles.textTitleWithEmail}>Detail menu</Text>
        <Text style={styles.textSubtitle}>Foto</Text>
        <Text style={styles.textSubtitle2}>
          Upload foto yang menarik biar pelanggan makin tertarik.
        </Text>

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
              width: wp(21),
              height: hp(10),
              borderRadius: 8,
              borderWidth: 1,
              justifyContent: 'center',
              marginTop: hp(1.5),
              borderColor: '#9FA2B4',
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
        <Text style={styles.textSubtitle}>Nama*</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={{color: '#565454'}}
          onChangeText={newText => setTextName(newText)}
          value={textName}
          placeholder="Nama"
          placeholderTextColor="#9FA2B4"
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
            marginBottom: 4,
          }}
        />

        <Text style={styles.textSubtitle}>Kategori*</Text>
        <View style={{height: hp(1)}} />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          schema={{
            label: 'name', // required
            value: 'id', // required
          }}
          placeholder="Pilih Kategori"
          setOpen={setOpen}
          setValue={setValue}
          placeholderStyle={{
            color: '#9FA2B4',
          }}
          setItems={setItems}
          dropDownContainerStyle={{
            borderColor: '#9FA2B4',
          }}
          style={{
            borderColor: '#9FA2B4',
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
            marginBottom: 4,
          }}
        />
        <Text style={styles.textSubtitle}>Deskripsi*</Text>
        <TextInput
          underlineColorAndroid="transparent"
          placeholder="Deskripsi"
          style={{color: '#565454'}}
          value={textDescription}
          onChangeText={newText => setTextDescription(newText)}
          placeholderTextColor="#9FA2B4"
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
            marginBottom: 4,
          }}
        />

        <Text style={styles.textSubtitle}>Harga*</Text>
        {/* 
        <TextInput
          underlineColorAndroid="transparent"
          keyboardType="number-pad"
          style={{color: '#565454'}}
          onChangeText={newText => setTextPrice(newText)}
          placeholder="Harga"
          placeholderTextColor="#9FA2B4"
          value={textPrice}
        /> */}
        <CurrencyInput
          value={textPrice}
          onChangeValue={setTextPrice}
          prefix="Rp "
          minValue={0}
          precision={0}
          style={{color: '#565454'}}
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
            marginBottom: 4,
          }}
        />
        <View style={{height: hp(2)}} />
        <Text style={styles.textTitleWithEmail}>Variasi menu</Text>

        <View style={{height: hp(2)}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textToggle}>Menu kosong</Text>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isEnabled ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={styles.textSubtitle2}>
          Menu kosong tidak bisa di pesan oleh pelanggan.
        </Text>

        {/* <View style={{height: hp(1)}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textToggle}>Hapus menu</Text>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isDelete ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitchDelete}
            value={isDelete}
          />
        </View>

        <Text style={styles.textSubtitle2}>Hapus menu</Text> */}

        <View style={{height: hp(15)}} />
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
          route.params.dataMenu ? updateMenu() : createMenu();
        }}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View>
            <Text style={styles.textAddMenu}>
              {route.params.dataMenu ? 'Update Menu' : 'Buat Menu'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <Modal isVisible={modalSuccess} onBackdropPress={visibilityModalSuccess}>
        <View style={styles.modalSuccess}>
          <Text style={styles.textTitle}>Berhasil!</Text>

          <View
            style={{
              flexDirection: 'row',
              marginTop: '5%',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#ff3366',
                height: hp(4),
                width: wp(20),
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '500', color: 'white'}}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default DetailMenuScreen;
