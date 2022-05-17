import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function DetailMenuScreen({navigation}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSwitchDelete = () => setIsDelete(previousState => !previousState);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);

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
          <Text style={styles.textHeader}>Ubah menu</Text>
          <Text style={styles.textSubHeader}>Ayam Taliwang</Text>
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

        <View
          style={{
            width: wp(21),
            height: hp(10),
            borderRadius: 8,
            borderWidth: 1,
            marginTop: hp(1.5),
            borderColor: '#ff3366',
          }}></View>

        <Text style={styles.textSubtitle}>Nama*</Text>
        <TextInput
          secureTextEntry={true}
          style={{marginTop: 10}}
          underlineColorAndroid="transparent"
          placeholder="Nama"
          placeholderTextColor="#9FA2B4"
          ref={input => {
            this.password = input;
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

        <Text style={styles.textSubtitle}>Kategori*</Text>
        <View style={{height: hp(1)}} />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Pilih kategori"
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
          secureTextEntry={true}
          style={{marginTop: 10}}
          underlineColorAndroid="transparent"
          placeholder="Deskripsi"
          placeholderTextColor="#9FA2B4"
          ref={input => {
            this.password = input;
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
        <Text style={styles.textSubtitle}>Nama*</Text>
        <TextInput
          secureTextEntry={true}
          style={{marginTop: 10}}
          underlineColorAndroid="transparent"
          placeholder="Nama"
          placeholderTextColor="#9FA2B4"
          ref={input => {
            this.password = input;
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
        <Text style={styles.textSubtitle}>Harga*</Text>
        <TextInput
          secureTextEntry={true}
          style={{marginTop: 10}}
          underlineColorAndroid="transparent"
          placeholder="Harga"
          placeholderTextColor="#9FA2B4"
          ref={input => {
            this.password = input;
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
        <View style={{height: hp(2)}} />
        <Text style={styles.textTitleWithEmail}>Variasi menu</Text>

        <View style={{height: hp(2)}} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textToggle}>Aktifkan menu</Text>
          <Switch
            trackColor={{false: '#B3B2B3', true: '#FFEBF0'}}
            thumbColor={isEnabled ? '#ff3366' : '#EDEDED'}
            ios_backgroundColor="#B3B2B3"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <Text style={styles.textSubtitle2}>
          Menu aktif akan muncul dan bisa di pesan oleh pelanggan.
        </Text>

        <View style={{height: hp(1)}} />
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

        <Text style={styles.textSubtitle2}>
          Upload foto yang menarik biar pelanggan makin tertarik.
        </Text>

        <View style={{height: hp(15)}} />
      </ScrollView>
      <View
        style={{
          height: hp(5),
          backgroundColor: '#ff3366',
          borderRadius: 4,
          justifyContent: 'center',
          position: 'absolute',
          bottom: hp(4),
          left: wp(24),
          right: wp(24),
        }}>
        <Text style={styles.textAddMenu}>Simpan</Text>
      </View>
    </View>
  );
}

export default DetailMenuScreen;
