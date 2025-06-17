import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAde1WXJk5Cy_O5Lp-anpFnpNR3H6JSkHE",
  authDomain: "final-sda202-app.firebaseapp.com",
  projectId: "final-sda202-app",
  storageBucket: "final-sda202-app",
  messagingSenderId: "323088257005",
  appId: "1:323088257005:ios:8ef7bd1171f8e7675721e4",
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with React Native Persistence
console.log("Initializing Firebase Auth...");
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
console.log("Firebase Auth initialized:", auth);

// Initialize Firestore
export const db = getFirestore(app);
