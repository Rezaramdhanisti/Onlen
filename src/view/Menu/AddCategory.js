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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useToast} from 'react-native-toast-notifications';
import {API_URL} from '@env';

import styles from './style';

function AddCategoryScreen({navigation}) {
  const [text, setText] = useState('');
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

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
        Alert.alert('Sukses', 'Kategori berhasil dibuat!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
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
          <Text style={styles.textHeader}>Tambah Kategori</Text>
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
          style={{marginTop: 10}}
          underlineColorAndroid="transparent"
          onChangeText={newText => setText(newText)}
          placeholder="Contoh: Makanan berat, minuman, cemilan"
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
        onPress={() => createCategory()}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View>
            <Text style={styles.textAddMenu}>Simpan</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default AddCategoryScreen;
