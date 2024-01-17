import { StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import OneSignal, {
  NotificationReceivedEvent,
  OSNotification,
} from "react-native-onesignal";

import { Routes } from "./src/routes";

import { THEME } from "./src/theme";
import { Loading } from "./src/components/Loading";

import { CartContextProvider } from "./src/contexts/CartContext";
import { useEffect, useState } from "react";
import { Notification } from "./src/components/Notification";

OneSignal.setAppId("13627ee8-9b83-478c-b714-4b176c356a2f");

OneSignal.promptForPushNotificationsWithUserResponse((response) => {});

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const [notification, setNotification] = useState<OSNotification>();

  useEffect(() => {
    const unsubscribe = OneSignal.setNotificationWillShowInForegroundHandler(
      (notifyEvent: NotificationReceivedEvent) => {
        const response = notifyEvent.getNotification();
        setNotification(response);
      }
    );

    return () => unsubscribe;
  }, []);

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <CartContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </CartContextProvider>
      {notification?.title && (
        <Notification
          title={notification?.title}
          onClose={() => {
            setNotification(undefined);
          }}
        />
      )}
    </NativeBaseProvider>
  );
}
