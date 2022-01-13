import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

async function saveTokenToDatabase(token: string) {
  // console.log("heyyy saveTokenToDatabase using axios", token);
}

const useFirebaseCloudMessaging = (
  showSplash: boolean,
  user: any,
  isAuthed: boolean
) => {
  // console.log("isAuthedisAuthed", isAuthed);

  useEffect(() => {
    // console.log("ue[] isAuthedisAuthed", isAuthed);
    if (!isAuthed) return;

    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        // console.log("got token fcm", token);
        // dZWDK3qQRoexXOYLU2nn98:APA91bGN8wSgI9McltA0iq4zY9_0oAgQrsN2sb2NPNB1rQCBs0GesWlxt5ODzhRgAbPPVoGCHzbIyC829JP-8wl_iQdGxYelLJM5WFkmJrema4th_z0f3v3GjB9XSZw-2xOK7OhO0jHh
        return saveTokenToDatabase(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      // console.log("got token fcm refreshed", token);
      saveTokenToDatabase(token);
    });
  }, [isAuthed]);
};

export default useFirebaseCloudMessaging;
