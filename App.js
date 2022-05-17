import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './src/view/Login';
import RegisterScreen from './src/view/Register';
import HomeScreen from './src/view/Home';
import SettingsScreen from './src/view/Settings';
import MenuScreen from './src/view/Menu';
import ListMenuScreen from './src/view/Menu/ListMenu';
import DetailMenuScreen from './src/view/Menu/DetailMenu';
import SplashScreen from './src/view/Splash';

import {ToastProvider} from 'react-native-toast-notifications';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="ListMenu" component={ListMenuScreen} />
          <Stack.Screen name="DetailMenu" component={DetailMenuScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

export default App;
