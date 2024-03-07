/*
 * @file: App.js
 * @description: App.js to render the app
 * @date: 20.06.2019
 * @author: Pushker Tiwari
 * */
//import { Platform} from "react-native";
import React, { Component } from "react";
import { Provider } from "react-redux";
//import { YellowBox } from "react-native";
//YellowBox.ignoreWarnings(["Warning: ReactNative.createElement"]);
//console.disableYellowBox = true;
import { store, persistor } from "../store";
import Nagivations from "./routes/Navigations";
import SplashScreen from "react-native-splash-screen";
console.reportErrorsAsExceptions = false;
import { PersistGate } from "redux-persist/lib/integration/react";
//import FCM, { NotificationActionType, FCMEvent} from "react-native-fcm";

import messaging from "@react-native-firebase/messaging";
import { baseUrlLive } from "./constants/url";
import { useEffect } from "react";
import { FCM_TOKEN } from "./actions/actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
// import * as RNIap from "react-native-iap";
import { Alert, Platform } from "react-native";
import { LogBox } from "react-native";
import { moderateScale } from "./helpers/ResponsiveFonts";
// export default class App extends Component {
const App = (props) => {
  // async componentDidMount()  {
  // do anything while splash screen keeps, use await to wait for an async task.
  //SplashScreen.hide();
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
      LogBox.ignoreAllLogs();
    }, 2000);

    requestUserPermission();

    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    //Notification for Forground state
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });

    //Notification click event
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification caused app to open states", remoteMessage);
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });

    //check weather initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state",
            remoteMessage.notification
          );
        }
      });

    return unsubscribe;
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
      getFirebaseToken();
    }
  }

  function getFirebaseToken() {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return saveTokenToDatabase(token);
      });
  }

  async function getPurchases() {
    // console.log("getPurchases method called");
    // RNIap.initConnection().then(async () => {
    //   try {
    //     if (Platform.OS == "ios") {
    //       const purchases = await RNIap.getAvailablePurchases();
    //       console.log("purchases=", JSON.stringify(purchases));
    //       purchases.forEach((purchase) => {
    //         updatePurchaseToServer(purchase);
    //       });
    //     }
    //   } catch (e) {
    //     console.log("purchases=", e);
    //   }
    // });
  }

  function updatePurchaseToServer(resp) {
    const obj = {
      SubscriptionId: resp.productId,
      TransactionDate: resp.transactionDate,
      TransactionID: resp.transactionId,
    };
    fetch(`${baseUrlLive}Payments/saveAppleResponse`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + userTokenData.access_token,
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (
          responseJson &&
          responseJson.statusCode &&
          responseJson.statusCode === 200
        ) {
          // this.props.navigation.navigate('HomeNew');
        } else {
          // Alert.alert('Something went wrong, Please try again');
        }
      })
      .catch((errorInFetch) => {
        console.log("errorInFetch", errorInFetch);
        // alert('Server not responding, try again.');
      });
  }

  async function saveTokenToDatabase(token) {
    console.log("token received " + token);
    // setValue(keys.FCM_TOKEN, token);
    try {
      await AsyncStorage.setItem(FCM_TOKEN, token);
    } catch (e) {
      // saving error
    }
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingBottom: moderateScale(-14),
          marginTop: moderateScale(-55),
        }}
      >
        <React.Fragment>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Nagivations />
            </PersistGate>
          </Provider>
        </React.Fragment>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
