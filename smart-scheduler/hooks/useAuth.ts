import { useState } from "react"
import { Alert } from "react-native"
import { signUp, signIn } from "../services/authService"

export function useAuth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (isSignUp && password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) throw error

      if (isSignUp) {
        Alert.alert("Success", "Check your email for verification link")
      }
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSignUp,
    toggleMode: () => setIsSignUp(!isSignUp),
    handleAuth,
    loading,
  }
}
