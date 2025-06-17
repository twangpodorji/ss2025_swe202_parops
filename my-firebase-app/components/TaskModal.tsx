"use client"

import { useState, useEffect } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"
import { useTaskStore } from "../shared/store/taskStore"
import { NotificationManager } from "../shared/utils/notification"

interface TaskModalProps {
  visible: boolean
  onClose: () => void
  task?: any
  selectedDate?: string
}

export default function TaskModal({ visible, onClose, task, selectedDate }: TaskModalProps) {
  const { createTask, updateTask, loading } = useTaskStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [scheduledDate, setScheduledDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  useEffect(() => {
    if (task) {
      // Editing existing task
      setTitle(task.title || "")
      setDescription(task.description || "")
      setPriority(task.priority || "medium")
      setScheduledDate(new Date(task.scheduledDate))
    } else {
      // Creating new task
      setTitle("")
      setDescription("")
      setPriority("medium")
      if (selectedDate) {
        const date = new Date(selectedDate)
        date.setHours(9, 0, 0, 0) // Default to 9 AM
        setScheduledDate(date)
      } else {
        setScheduledDate(new Date())
      }
    }
  }, [task, selectedDate, visible])

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title")
      return
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      scheduledDate: scheduledDate.toISOString(),
    }

    let result
    if (task) {
      result = await updateTask(task.id, taskData)
      if (result.success) {
        await NotificationManager.showTaskActionNotification("Updated", title)
      }
    } else {
      result = await createTask(taskData)
      if (result.success) {
        await NotificationManager.scheduleTaskNotification({
          ...taskData,
          id: result.id,
        })
        await NotificationManager.showTaskActionNotification("Created", title)
      }
    }

    if (result.success) {
      onClose()
    } else {
      Alert.alert("Error", result.error)
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setScheduledDate(selectedDate)
    }
  }

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newDate = new Date(scheduledDate)
      newDate.setHours(selectedTime.getHours())
      newDate.setMinutes(selectedTime.getMinutes())
      setScheduledDate(newDate)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{task ? "Edit Task" : "New Task"}</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveButton, loading && styles.saveButtonDisabled]}>
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description (optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={priority} onValueChange={setPriority} style={styles.picker}>
                <Picker.Item label="Low Priority" value="low" />
                <Picker.Item label="Medium Priority" value="medium" />
                <Picker.Item label="High Priority" value="high" />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <Text style={styles.dateTimeText}>{scheduledDate.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <Text style={styles.dateTimeText}>
                  {scheduledDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
          />
        )}
      </View>
    </Modal>
  )
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
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    color: "#ccc",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
})
