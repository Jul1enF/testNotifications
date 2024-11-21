
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {

  const [notification, setNotification] = useState([]);


  const notificationListener = useRef('');
  const responseListener = useRef('');


  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notif => {
      setNotification(notification => [...notification, notif]);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("RESPONSE :", response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };

  }, []);


  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
