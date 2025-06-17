"use client";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebase";
import { useAuthStore } from "../shared/store/taskStore";
import { NotificationManager } from "../shared/utils/notification";

export default function RootLayout() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Initialize notifications
    NotificationManager.requestPermissions();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
