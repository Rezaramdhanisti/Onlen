import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
  Switch,
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
  const [text, setText] = useState(route.params ? route?.params?.name : '');
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [dataRoles, setDataRoles] = useState([]);
  const [idRoles, setIdRoles] = useState(
    route.params ? route?.params?.roleId : '',
  );
  const [textEmail, setTextEmail] = useState(
    route.params ? route?.params?.email : '',
  );
  const [textPassword, setTextPassword] = useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isEnabled, setIsEnabled] = useState(
    route?.params?.status === 'active' ? true : false,
  );

  useEffect(() => {
    getListRoles();
  }, []);

  const getListRoles = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .get(`${API_URL}/dashboard/accounts/roles`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(res => {
        setDataRoles(res.data.data);
      })
      .catch(e => {
        toast.show(e?.response?.data.message, {type: 'danger'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createEmployee = async () => {
    if (text.length < 1) {
      return toast.show('Isi dulu nama karyawannya yaa', {type: 'danger'});
    }
    if (textEmail.length < 1) {
      return toast.show('Isi dulu email yaa', {type: 'danger'});
    }
    if (textPassword.length < 1) {
      return toast.show('Isi dulu password yaa', {type: 'danger'});
    }
    if (idRoles.length < 1) {
      return toast.show('Pilih Role dulu password yaa', {type: 'danger'});
    }
    const dataPayload = {
      name: text,
      email: textEmail,
      password: textPassword,
      roleId: idRoles,
    };
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .post(`${API_URL}/dashboard/accounts`, dataPayload, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(() => {
        Alert.alert('Sukses', 'Akun berhasil ditambahkan!', [
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

  const updateEmployee = async () => {
    const dataPayload = {
      name: text,
      email: textEmail,
      roleId: idRoles,
      status: isEnabled ? 'active' : 'inactive',
    };

    console.log('dataPayload', dataPayload);
    setLoading(true);
    const token = await AsyncStorage.getItem('@token');
    axios
      .put(`${API_URL}/dashboard/accounts/${route?.params?.id}`, dataPayload, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(() => {
        Alert.alert('Sukses', 'Akun berhasil diupdate!', [
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

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => setIdRoles(item.id)}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 18,
          alignItems: 'center',
          marginLeft: 20,
        }}>
        {item.id === idRoles ? (
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
        ) : (
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'grey',
            }}></View>
        )}
        <Text style={styles.textSubtitleNoMargin}>{item.name}</Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: '#E8EBEB',
          marginVertical: 16,
        }}
      />
    </TouchableOpacity>
  );

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
        <FlatList
          data={dataRoles}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />

        <Text style={styles.textSubtitle}>Detail Karyawan</Text>
        <Text style={styles.textSubtitle2}>
          Ini akan menjadi akun dan detail masuk mereka
        </Text>
        <TextInput
          style={{marginTop: 18, color: '#565454'}}
          underlineColorAndroid="transparent"
          onChangeText={newText => setText(newText)}
          value={text}
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
        <TextInput
          style={{marginTop: 18, color: '#565454'}}
          underlineColorAndroid="transparent"
          onChangeText={newText => setTextEmail(newText)}
          value={textEmail}
          placeholder="Email"
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
        <TextInput
          secureTextEntry
          style={{marginTop: 18, color: '#565454'}}
          underlineColorAndroid="transparent"
          onChangeText={newText => setTextPassword(newText)}
          placeholder="Password"
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={styles.textToggle}>Status akun</Text>
            <Text style={styles.textSubtitle2}>
              Aktifkan atau nonaktifkan akun
            </Text>
          </View>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isEnabled ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity
          style={{
            height: hp(5),
            width: wp(42),
            alignSelf: 'center',
            backgroundColor: '#ff3366',
            borderRadius: 4,
            justifyContent: 'center',
            marginTop: hp(5),
          }}
          onPress={() => (route?.params ? updateEmployee() : createEmployee())}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <View>
              <Text style={styles.textAddMenu}>Simpan</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default AddEmployeeScreen;
