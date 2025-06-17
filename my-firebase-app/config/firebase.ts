import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAde1WXJk5Cy_O5Lp-anpFnpNR3H6JSkHE",
  authDomain: "final-sda202-app.firebaseapp.com",
  projectId: "final-sda202-app",
  storageBucket: "final-sda202-app.appspot.com",
  messagingSenderId: "323088257005",
  appId: "1:323088257005:ios:8ef7bd1171f8e7675721e4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use AsyncStorage for Firebase Auth persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
