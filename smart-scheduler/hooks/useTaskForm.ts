import { useState } from "react"
import { Alert } from "react-native"
import { addTask } from "../services/taskService"
import { scheduleTaskNotification, sendTaskNotification } from "../lib/notifications"

export const useTaskForm = (navigation) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(new Date())
  const [loading, setLoading] = useState(false)

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title")
      return
    }

    setLoading(true)
    try {
      await addTask({ title, description, dueDate })
      try {
        await scheduleTaskNotification(title, dueDate)
        await sendTaskNotification("Task Created", `${title} has been scheduled`)
      } catch (e) {
        console.log("Notification issue:", e)
      }

      Alert.alert("Success", "Task added successfully", [
        {
          text: "OK",
          onPress: () => {
            resetForm()
            navigation.navigate("Tasks")
          },
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to add task")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDueDate(new Date())
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    loading,
    handleAddTask,
  }
}
