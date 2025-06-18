"use client"

import { useState, useCallback } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { supabase, type Task } from "../lib/supabase"
import { useFocusEffect } from "@react-navigation/native"
import { sendTaskNotification } from "../lib/notifications"

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchTasks = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      Alert.alert("Error", "Failed to fetch tasks")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTasks()
    }, []),
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchTasks()
  }

  const toggleTaskComplete = async (task: Task) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          completed: !task.completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", task.id)

      if (error) throw error

      // Try to send notification, but don't fail if it doesn't work
      try {
        await sendTaskNotification(
          "Task Updated",
          `${task.title} marked as ${!task.completed ? "completed" : "incomplete"}`,
        )
      } catch (notificationError) {
        console.log("Notification error (this is normal in Expo Go):", notificationError)
      }

      fetchTasks()
    } catch (error) {
      Alert.alert("Error", "Failed to update task")
    }
  }

  const deleteTask = async (taskId: string, taskTitle: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.from("tasks").delete().eq("id", taskId)

            if (error) throw error

            // Try to send notification, but don't fail if it doesn't work
            try {
              await sendTaskNotification("Task Deleted", `${taskTitle} has been deleted`)
            } catch (notificationError) {
              console.log("Notification error (this is normal in Expo Go):", notificationError)
            }

            fetchTasks()
          } catch (error) {
            Alert.alert("Error", "Failed to delete task")
          }
        },
      },
    ])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date() && !tasks.find((t) => t.due_date === dateString)?.completed
  }

  const renderTask = ({ item }: { item: Task }) => (
    <View
      style={[styles.taskItem, item.completed && styles.completedTask, isOverdue(item.due_date) && styles.overdueTask]}
    >
      <TouchableOpacity style={styles.taskContent} onPress={() => navigation.navigate("EditTask", { task: item })}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, item.completed && styles.completedText]}>{item.title}</Text>
          <Text style={[styles.taskDate, isOverdue(item.due_date) && styles.overdueText]}>
            {formatDate(item.due_date)}
          </Text>
        </View>
        {item.description ? (
          <Text style={[styles.taskDescription, item.completed && styles.completedText]}>{item.description}</Text>
        ) : null}
      </TouchableOpacity>

      <View style={styles.taskActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleTaskComplete(item)}>
          <Ionicons
            name={item.completed ? "checkmark-circle" : "checkmark-circle-outline"}
            size={24}
            color={item.completed ? "#4CAF50" : "#666"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => deleteTask(item.id, item.title)}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading tasks...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Text style={styles.emptySubtext}>Tap the + tab to add your first task</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    padding: 15,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.7,
  },
  overdueTask: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  taskDate: {
    fontSize: 12,
    color: "#666",
  },
  overdueText: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
})
