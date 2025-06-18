import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "../../lib/supabase"

export default function ActionButtons({ onRefresh }: { onRefresh: () => void }) {
  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut()
          if (error) Alert.alert("Error", "Failed to sign out")
        },
      },
    ])
  }

  return (
    <View style={styles.actionsSection}>
      <TouchableOpacity style={styles.actionButton} onPress={onRefresh}>
        <Ionicons name="refresh" size={20} color="#007AFF" />
        <Text style={styles.actionText}>Refresh Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.signOutButton]} onPress={handleSignOut}>
        <Ionicons name="log-out" size={20} color="#FF6B6B" />
        <Text style={[styles.actionText, { color: "#FF6B6B" }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  actionsSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: "#fff5f5",
  },
  actionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#007AFF",
  },
})
