import { StyleSheet, View, Text, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';


export default function HomeScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');


  async function registerForPushNotificationsAsync() {

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('boost-up', {
        name: 'boost-up',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas.projectId ?? Constants.easConfig?.projectId;

      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        setExpoPushToken(pushTokenString)

        return;

      } catch (e) {
        console.log(e);
      }
    }
    // Si sur emulator
    else {
      return
    }
  }


  useEffect(()=>{
    registerForPushNotificationsAsync()
  },[])

  return (
    <View style={styles.body}>
      <Text style={{ fontSize: 30 }}>Your push token is : {expoPushToken}. </Text>
      <Text style={{ fontSize: 30 }}>Try sending multiples notifications while your phone is off with expo Push notifications tool. Wait 3 minutes after the last sent before turning your phone back on and see if you get all the notifications.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  }
});
