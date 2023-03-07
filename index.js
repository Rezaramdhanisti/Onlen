/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import OneSignal from 'react-native-onesignal';

//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId('7b799cf0-356b-4f90-93d8-b723c09dd027', {
  kOSSettingsKeyAutoPrompt: false,
  kOSSettingsKeyInFocusDisplayOption: 2,
});
//END OneSignal Init Code

//Prompt for push on iOS
// OneSignal.promptForPushNotificationsWithUserResponse(response => {
//   console.log('Prompt response:', response);
// });

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    console.log(
      'OneSignal: notification will show in foreground:',
      notificationReceivedEvent,
    );
    let notification = notificationReceivedEvent.getNotification();
    const data = notification.additionalData;
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  },
);

AppRegistry.registerComponent(appName, () => App);
