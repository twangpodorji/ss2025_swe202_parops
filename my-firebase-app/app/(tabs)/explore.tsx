"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore, useAuthStore } from "../../shared/store/taskStore";
import { DateUtils } from "../../shared/utils/dateUtils";
import TaskModal from "../../components/TaskModal";

export default function TasksScreen() {
  const { user } = useAuthStore();
  const { tasks, deleteTask, subscribeToTasks } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid);
      return unsubscribe;
    }
  }, [user]);

  interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    scheduledDate: string;
  }

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteTask(task.id);
            if (result.success) {
              Alert.alert("Success", "Task deleted successfully");
            } else {
              Alert.alert("Error", result.error || "Failed to delete task");
            }
          },
        },
      ]
    );
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const renderTask = ({ item: task }: { item: Task }) => (
    <View
      style={[
        styles.taskItem,
        {
          borderLeftColor:
            task.priority === "high"
              ? "#ff4444"
              : task.priority === "medium"
              ? "#ffaa00"
              : "#00aa00",
          opacity: DateUtils.isPast(task.scheduledDate) ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDate}>
          {DateUtils.formatDateTime(task.scheduledDate)}
        </Text>
        {task.description && (
          <Text style={styles.taskDescription}>{task.description}</Text>
        )}
        <View style={styles.taskMeta}>
          <Text
            style={[
              styles.priorityBadge,
              {
                backgroundColor:
                  task.priority === "high"
                    ? "#ff4444"
                    : task.priority === "medium"
                    ? "#ffaa00"
                    : "#00aa00",
              },
            ]}
          >
            {task.priority}
          </Text>
          {DateUtils.isPast(task.scheduledDate) && (
            <Text style={styles.pastBadge}>Past</Text>
          )}
        </View>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditTask(task)}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteTask(task)}
        >
          <Ionicons name="trash" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Tasks ({tasks.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedTask(null);
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to create your first task
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        task={selectedTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityBadge: {
    color: "white",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "uppercase",
    fontWeight: "600",
    marginRight: 8,
  },
  pastBadge: {
    backgroundColor: "#999",
    color: "white",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});
