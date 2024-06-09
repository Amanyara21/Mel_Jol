import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { PermissionsAndroid } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
// Hooks
import { AuthComponent } from './Hooks/useAuth';

import messaging from '@react-native-firebase/messaging';

import NotificationHandler from './Components/NotificationHelper';
import StackNavigator from './StackNavigator';

function App() {

  // const unsubscribe = messaging().onMessage(async remoteMessage => {
  //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  // });


  useEffect(() => {
    requestAllPermissions()
  }, [])
  const requestAllPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions, {
        title: 'Mel Jol App Permissions',
        message: 'Mel Jol App needs various permissions for functionality.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
  

      let allPermissionsGranted = true;

      for (const permission in granted) {
        if (granted[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
          allPermissionsGranted = false;
          console.log(`${permission} permission denied`);
        }
      }

      if (allPermissionsGranted) {
        console.log('All permissions granted');
      } else {
        console.log('Some permissions were denied');
      }

    } catch (err) {
      console.warn(err);
    }
  };


  return (
    <NavigationContainer>
      <AuthComponent>
        <StackNavigator />
        <NotificationHandler />
      </AuthComponent>
    </NavigationContainer>


  );
}



// #52D3D8
// #3887BE
// #38419D
// #200E3A




export default App;
