"use client";

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useTaskStore, useAuthStore } from "../../shared/store/taskStore";
import { DateUtils } from "../../shared/utils/dateUtils";
import TaskModal from "../../components/TaskModal";

interface Day {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp?: number;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  scheduledDate: string;
}

interface MarkedDate {
  selected?: boolean;
  selectedColor?: string;
  marked?: boolean;
  dotColor?: string;
}

export default function CalendarScreen() {
  const { user } = useAuthStore();
  const {
    tasks,
    selectedDate,
    setSelectedDate,
    getTasksForDate,
    subscribeToTasks,
  } = useTaskStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid);
      return unsubscribe;
    }
  }, [user]);

  // Initialize markedDates properly
  const markedDates: Record<string, MarkedDate> = {};

  const tasksForSelectedDate = getTasksForDate(selectedDate);

  const handleDayPress = (day: Day) => {
    setSelectedDate(day.dateString);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: "#007AFF",
          },
        }}
        theme={{
          selectedDayBackgroundColor: "#007AFF",
          todayTextColor: "#007AFF",
          arrowColor: "#007AFF",
        }}
      />

      <View style={styles.tasksContainer}>
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>
            Tasks for {DateUtils.formatDate(selectedDate)}
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {tasksForSelectedDate.length === 0 ? (
          <Text style={styles.noTasksText}>
            No tasks scheduled for this date
          </Text>
        ) : (
          tasksForSelectedDate.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskItem,
                {
                  borderLeftColor:
                    task.priority === "high"
                      ? "#ff4444"
                      : task.priority === "medium"
                      ? "#ffaa00"
                      : "#00aa00",
                },
              ]}
              onPress={() => handleEditTask(task)}
            >
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskTime}>
                  {DateUtils.formatTime(task.scheduledDate)}
                </Text>
                {task.description && (
                  <Text style={styles.taskDescription}>{task.description}</Text>
                )}
              </View>
              <View style={styles.taskActions}>
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
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        task={selectedTask}
        selectedDate={selectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tasksContainer: {
    flex: 1,
    padding: 16,
  },
  tasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 18,
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
  noTasksText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 32,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  taskTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#888",
  },
  taskActions: {
    alignItems: "flex-end",
  },
  priorityBadge: {
    color: "white",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});
