import { Alert, AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  Alert.alert(
    remoteMessage.notification.title,
    remoteMessage.notification.body
  );
});

messaging().getInitialNotification(async (remoteMessage) => {
  console.log("Message handled in the kii state!", remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
