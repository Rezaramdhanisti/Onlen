import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useToast} from 'react-native-toast-notifications';
import {API_URL} from '@env';

import styles from './style';

function AddCategoryScreen({navigation, route}) {
  const [text, setText] = useState(
    route.params ? route?.params?.categoryName : '',
  );
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const createCategory = async () => {
    if (text.length < 1) {
      return toast.show('Isi dulu kategorinya yaa', {type: 'danger'});
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .post(
        `${API_URL}/dashboard/categories`,
        {name: text},
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

  const updateCategory = async () => {
    if (text.length < 1) {
      return toast.show('Isi dulu kategorinya yaa', {type: 'danger'});
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .put(
        `${API_URL}/dashboard/categories/${route?.params?.categoryId}`,
        {name: text},
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

  const visibilityModalSuccess = () => {
    setModalSuccess(!modalSuccess);
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
          <Text style={styles.textHeader}>
            {route.params ? 'Ubah Kategori' : 'Tambah Kategori'}
          </Text>
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
        <Text style={styles.textSubtitle}>Nama Kategori</Text>
        <TextInput
          style={{marginTop: 10, color: '#565454'}}
          underlineColorAndroid="transparent"
          onChangeText={newText => setText(newText)}
          placeholder="Contoh: Makanan berat, minuman, cemilan"
          placeholderTextColor="#9FA2B4"
          value={text}
        />
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginTop: 6,
            marginBottom: 4,
          }}
        />
      </ScrollView>
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
        onPress={() => (route.params ? updateCategory() : createCategory())}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View>
            <Text style={styles.textAddMenu}>Simpan</Text>
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

export default AddCategoryScreen;
