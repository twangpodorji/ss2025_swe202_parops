"use client"

import React from "react"
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native"
import AuthForm from "../components/Auth/AuthForm"
import { useAuth } from "../hooks/useAuth"

export default function AuthScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSignUp,
    toggleMode,
    handleAuth,
    loading,
  } = useAuth()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleAuth}
        isSignUp={isSignUp}
        loading={loading}
        toggleMode={toggleMode}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
})
