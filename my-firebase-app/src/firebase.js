import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAde1WXJk5Cy_O5Lp-anpFnpNR3H6JSkHE",
  authDomain: "final-sda202-app.firebaseapp.com",
  projectId: "final-sda202-app",
  storageBucket: "final-sda202-app.appspot.com",
  messagingSenderId: "323088257005",
  appId: "1:323088257005:ios:8ef7bd1171f8e7675721e4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);