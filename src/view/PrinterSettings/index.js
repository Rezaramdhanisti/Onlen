import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import {BluetoothManager} from 'tp-react-native-bluetooth-printer';
import ItemList from './ItemList';
import SamplePrint from './SamplePrint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from './style';

function PrinterSettingScreen({navigation, route}) {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(
    route.params ? JSON.parse(route?.params).name : '',
  );
  const [boundAddress, setBoundAddress] = useState(
    route.params ? JSON.parse(route?.params).address : '',
  );

  useEffect(() => {
    setTimeout(() => {
      _activateBluetooth();
    }, 1500);
  }, []);

  const _activateBluetooth = useCallback(() => {
    BluetoothManager.enableBluetooth().then(
      r => {
        var paired = [];
        if (r && r.length > 0) {
          for (var i = 0; i < r.length; i++) {
            try {
              paired.push(JSON.parse(r[i])); // NEED TO PARSE THE DEVICE INFORMATION
            } catch (e) {
              //ignore
            }
          }
        }
        console.log(JSON.stringify(paired));
        _checkBluetooth();
        scan();
      },
      err => {
        alert('Mohon aktifkan bluetooth ');
      },
    );
  }, []);

  const _disableBluetooth = useCallback(() => {
    BluetoothManager.disableBluetooth().then(
      () => {
        console.log('sakses');
        setTimeout(() => {
          _checkBluetooth();
          scan();
        }, 500);
      },
      err => {
        alert(err);
      },
    );
  }, []);

  const _pullToRefresh = useCallback(() => {
    _checkBluetooth();
    scan();
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
      rsp => {
        deviceAlreadPaired(rsp);
      },
    );
  }, []);

  useEffect(() => {
    // if (Platform.OS === 'ios') {
    //   let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
    //   bluetoothManagerEmitter.addListener(
    //     BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
    //     rsp => {
    //       deviceAlreadPaired(rsp);
    //     },
    //   );
    //   bluetoothManagerEmitter.addListener(
    //     BluetoothManager.EVENT_DEVICE_FOUND,
    //     rsp => {
    //       deviceFoundEvent(rsp);
    //     },
    //   );
    //   bluetoothManagerEmitter.addListener(
    //     BluetoothManager.EVENT_CONNECTION_LOST,
    //     () => {
    //       setName('');
    //       setBoundAddress('');
    //     },
    //   );
    // } else if
    //  (Platform.OS === 'android') {
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
      rsp => {
        deviceAlreadPaired(rsp);
      },
    );
    DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
      deviceFoundEvent(rsp);
    });
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_CONNECTION_LOST,
      () => {
        setName('');
        setBoundAddress('');
      },
    );
    DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
      () => {
        ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
      },
    );
    // }
    if (pairedDevices.length < 1) {
      scan();
    }
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connect = row => {
    setLoading(true);
    BluetoothManager.connect(row.address).then(
      s => {
        setLoading(false);
        setBoundAddress(row.address);
        setName(row.name || 'UNKNOWN');
        storePrinterData(row);
      },
      e => {
        setLoading(false);
        alert('Pastikan printer dalam keadaan aktif');
      },
    );
  };

  const storePrinterData = async value => {
    try {
      await AsyncStorage.setItem('@printer', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  const unPair = address => {
    // setLoading(true);
    BluetoothManager.unpair(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const scanDevices = useCallback(() => {
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  const _checkBluetooth = useCallback(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
      },
      err => {
        err;
      },
    );
  }, []);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'Onlen App meminta izin untuk mengakses bluetooth',
          message:
            'Onlen App memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          onRefresh={_pullToRefresh}
          refreshing={loading}
          onPress={() => _activateBluetooth()}
        />
      }>
      <View
        style={{
          flexDirection: 'row',
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
          <Text style={styles.textHeader}>Pengaturan Printer</Text>
        </View>
      </View>
      {!bleOpend && (
        <Text style={styles.bluetoothInfo}>Mohon aktifkan bluetooth anda</Text>
      )}
      <View style={{height: hp(2)}} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textToggle}>Status bluetooth</Text>
          <Text
            style={styles.textPrinterStatus(bleOpend ? '#47BF34' : '#E9493F')}>
            {' '}
            ({bleOpend ? 'Aktif' : 'Tidak aktif'})
          </Text>
        </View>
      </View>
      <Text style={styles.textSubtitle2}>Pelanggan makan ditempat</Text>

      <TouchableOpacity
        style={styles.bluetoothStatusContainer}
        onPress={() => _activateBluetooth()}>
        <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#47BF34')}>
          Klik disini untuk aktifkan bluetooth
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.bluetoothStatusContainer}
        onPress={() => _activateBluetooth()}>
        <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
          Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bluetoothStatusContainer}
        onPress={() => _disableBluetooth()}>
        <Text style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
          Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
        </Text>
      </TouchableOpacity> */}

      <Text style={styles.sectionTitle}>
        Printer yang terhubung ke aplikasi:
      </Text>
      {boundAddress.length > 0 && (
        <ItemList
          label={name}
          value={boundAddress}
          onPress={() => unPair(boundAddress)}
          actionText="Putus"
          color="#E9493F"
        />
      )}
      {boundAddress.length < 1 && (
        <Text style={styles.printerInfo}>Belum ada printer yang terhubung</Text>
      )}
      <Text style={styles.sectionTitle}>
        Bluetooth yang terhubung ke HP ini:
      </Text>
      {/* {loading ? <ActivityIndicator animating={true} /> : null} */}
      <View style={styles.containerList}>
        {pairedDevices.map((item, index) => {
          return (
            <ItemList
              key={index}
              onPress={() => connect(item)}
              label={item.name}
              value={item.address}
              connected={item.address === boundAddress}
              actionText="Hubungkan"
              color="#00BCD4"
            />
          );
        })}
      </View>
      {/* {boundAddress.length > 0 &&  */}
      <SamplePrint />
      {/* } */}
      <View style={{height: 100}} />
    </ScrollView>
  );
}

export default PrinterSettingScreen;
