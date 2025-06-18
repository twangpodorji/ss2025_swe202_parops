import React from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native"

interface AuthFormProps {
  email: string
  setEmail: (val: string) => void
  password: string
  setPassword: (val: string) => void
  onSubmit: () => void
  isSignUp: boolean
  loading: boolean
  toggleMode: () => void
}

export default function AuthForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  isSignUp,
  loading,
  toggleMode,
}: AuthFormProps) {
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Smart Scheduler</Text>
      <Text style={styles.subtitle}>{isSignUp ? "Create your account" : "Welcome back"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
        <Text style={styles.switchText}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#007AFF",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    textAlign: "center",
    color: "#007AFF",
    fontSize: 14,
  },
})
