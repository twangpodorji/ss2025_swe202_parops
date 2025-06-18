"use client"

import { ScrollView, Alert } from "react-native"
import TaskForm from "../components/TaskForm"
import { updateTask } from "../services/taskService"
import { scheduleTaskNotification, sendTaskNotification } from "../lib/notifications"
import { useTaskForm } from "../hooks/useTaskForm"

export default function EditTaskScreen({ route, navigation }) {
  const { task } = route.params
  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    loading,
    setLoading,
  } = useTaskForm(task)

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title")
      return
    }

    setLoading(true)
    try {
      const { error } = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate.toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      try {
        await scheduleTaskNotification(title, dueDate)
        await sendTaskNotification("Task Updated", `${title} has been updated`)
      } catch (err) {
        console.log("Notification error:", err)
      }

      Alert.alert("Success", "Task updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      Alert.alert("Error", "Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <TaskForm
        title={title}
        description={description}
        dueDate={dueDate}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
        onChangeDueDate={setDueDate}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Update Task"
      />
    </ScrollView>
  )
}
