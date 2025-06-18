import { View, Text, StyleSheet } from "react-native"

export default function TaskStats({ stats }: { stats: { total: number; completed: number; pending: number } }) {
  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Task Statistics</Text>
      <View style={styles.statsGrid}>
        <StatItem label="Total Tasks" value={stats.total} color="#007AFF" />
        <StatItem label="Completed" value={stats.completed} color="#4CAF50" />
        <StatItem label="Pending" value={stats.pending} color="#FF9800" />
      </View>
    </View>
  )
}

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  statsSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
})
