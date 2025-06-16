import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { auth } from "./src/firebase";

export default function App() {
  useEffect(() => {
    console.log("Firebase Auth Instance:", auth);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Firebase with Expo!</Text>
    </View>
  );
}