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

function AddEmployeeScreen({navigation, route}) {
  const [text, setText] = useState(
    route.params ? route?.params?.EmployeeName : '',
  );
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);

  const createEmployee = async () => {
    if (text.length < 1) {
      return toast.show('Isi dulu Karyawannya yaa', {type: 'danger'});
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
        Alert.alert('Sukses', 'Karyawan berhasil dibuat!', [
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
          <Text style={styles.textHeader}>Tambahkan Karyawan</Text>
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
        <Text style={styles.textSubtitle}>Pilih peran untuk mereka</Text>
        <Text style={styles.textSubtitle2}>
          Peran mereka akan menentukan tingkat akses mereka
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 18,
            alignItems: 'center',
            marginLeft: 20,
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'grey',
            }}></View>

          <Text style={styles.textSubtitleNoMargin}>Admin</Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginVertical: 16,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
            marginLeft: 20,
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#ff3366',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 16,
                backgroundColor: '#ff3366',
              }}></View>
          </View>

          <Text style={styles.textSubtitleNoMargin}>Admin</Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#E8EBEB',
            marginVertical: 20,
          }}
        />

        <Text style={styles.textSubtitle}>Detail Karyawan</Text>
        <Text style={styles.textSubtitle2}>
          Ini akan menjadi akun dan detail masuk mereka
        </Text>
        <TextInput
          style={{marginTop: 18}}
          underlineColorAndroid="transparent"
          onChangeText={newText => setText(newText)}
          placeholder="Nama"
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
        <TextInput
          style={{marginTop: 18}}
          underlineColorAndroid="transparent"
          onChangeText={newText => setText(newText)}
          placeholder="Email"
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
      {!route.params && (
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
          onPress={() => createEmployee()}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <View>
              <Text style={styles.textAddMenu}>Simpan</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

export default AddEmployeeScreen;
