import React, {useEffect} from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Text,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import helpers from './src/helpers';

import LoginScreen from './src/view/Login';
import RegisterScreen from './src/view/Register';
import HomeScreen from './src/view/Home';
import HomeV2Screen from './src/view/Home-v2';
import SettingsScreen from './src/view/Settings';
import MenuScreen from './src/view/Menu';
import LandingPageScreen from './src/view/LandingPage';
import LandingDetailScreen from './src/view/LandingPage/LandingDetail';
import ListMenuScreen from './src/view/Menu/ListMenu';
import DetailMenuScreen from './src/view/Menu/DetailMenu';
import AddCategoryScreen from './src/view/Menu/AddCategory';
import ShowMenuScreen from './src/view/Menu/ShowMenu';
import SplashScreen from './src/view/Splash';
import EmployeeScreen from './src/view/Employee';
import AddEmployeeScreen from './src/view/Employee/AddEmployee';
import OrderTodayScreen from './src/view/Order/OrderToday';
import OrderProcessScreen from './src/view/Order/OrderProcess';
import OrderFinishScreen from './src/view/Order/OrderFinish';
import MyQrisScreen from './src/view/Settings/MyQris';
import PrinterSettingsScreen from './src/view/PrinterSettings';

import MerchantSettingScreen from './src/view/Settings/MerchantSetting';

import {navigationRef, isReadyRef} from './RootNavigation';
import {ToastProvider} from 'react-native-toast-notifications';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ff3366',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          width: '100%',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          borderTopWidth: 0,
          shadowColor: 'black',
          elevation: 8,
          position: 'absolute',
          bottom: 0,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeV2Screen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          tabBarLabel: 'Beranda',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 28,
                  tintColor: focused ? '#ff3366' : '#2D2D2D',
                  height: 28,
                  resizeMode: 'contain',
                }}
                source={require('./assets/home.png')}
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Pesanan"
        component={MyTabs}
        options={{
          gestureEnabled: false,
          headerShown: false,
          tabBarLabel: 'Pesanan',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? '#ff3366' : '#2D2D2D',
                  resizeMode: 'contain',
                }}
                source={require('./assets/order.png')}
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Produk"
        component={MenuScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          tabBarLabel: 'Produk',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? '#ff3366' : '#2D2D2D',
                  resizeMode: 'contain',
                }}
                source={require('./assets/product.png')}
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Pengaturan"
        component={SettingsScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          tabBarLabel: 'Pengaturan',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 28,
                  height: 28,
                  tintColor: focused ? '#ff3366' : '#2D2D2D',
                  resizeMode: 'contain',
                }}
                source={require('./assets/setting.png')}
              />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function MyTabBar({state, descriptors, navigation, position}) {
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: wp(5),
          alignItems: 'center',
          marginTop: hp(2),
          marginBottom: hp(2),
        }}>
        <Text
          style={{
            fontSize: helpers.scaling.moderateScale(16),
            color: '#565454',
            letterSpacing: 0.34,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Pesanan
        </Text>
      </View>

      <View style={{flexDirection: 'row'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          });

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                height: hp(5),
              }}>
              <View
                style={{
                  backgroundColor: isFocused ? '#FFDBD4' : 'white',
                  borderRadius: 14,
                }}>
                <Animated.Text
                  style={{
                    color: isFocused ? 'black' : 'grey',
                    fontWeight: '500',
                    fontSize: 14,
                    paddingHorizontal: 20,
                    paddingVertical: 6,
                  }}>
                  {label}
                </Animated.Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Baru" component={OrderTodayScreen} />
      <Tab.Screen name="Proses" component={OrderProcessScreen} />
      <Tab.Screen name="Selesai" component={OrderFinishScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <ToastProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={BottomTabs}
            options={{gestureEnabled: false, headerShown: false}}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ListMenu"
            component={ListMenuScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DetailMenu"
            component={DetailMenuScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddCategory"
            component={AddCategoryScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Employee"
            component={EmployeeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddEmployee"
            component={AddEmployeeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MerchantSetting"
            component={MerchantSettingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ShowMenu"
            component={ShowMenuScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MyQris"
            component={MyQrisScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Order"
            component={MyTabs}
            options={{
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="LandingPage"
            component={LandingPageScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LandingDetail"
            component={LandingDetailScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PrinterSettings"
            component={PrinterSettingsScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

export default App;
