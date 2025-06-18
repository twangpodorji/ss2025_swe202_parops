"use client"

import { View, StyleSheet } from "react-native"
import { useUser } from "../hooks/useUser"
import { useTaskStats } from "../hooks/useTaskStats"
import Avatar from "../components/profile/Avatar"
import TaskStats from "../components/profile/TaskStats"
import ActionButtons from "../components/profile/ActionButtons"

export default function ProfileScreen() {
  const user = useUser()
  const { stats, refreshStats } = useTaskStats(user?.id)

  if (!user) return null

  return (
    <View style={styles.container}>
      <Avatar email={user.email} created_at={user.created_at} />
      <TaskStats stats={stats} />
      <ActionButtons onRefresh={refreshStats} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
})
