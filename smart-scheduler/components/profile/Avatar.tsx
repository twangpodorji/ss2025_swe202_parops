import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function Avatar({ email, created_at }: { email: string; created_at?: string }) {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={40} color="#007AFF" />
      </View>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.joinDate}>
        Member since {created_at ? new Date(created_at).toLocaleDateString() : "N/A"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  email: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: "#666",
  },
})
