"use client"

import { ScrollView, View, Text, StyleSheet } from "react-native"
import { useTaskForm } from "../hooks/useTaskForm"
import InputField from "../components/TaskScreenUI/InputField"
import TextArea from "../components/TaskScreenUI/TextArea"
import PrimaryButton from "../components/TaskScreenUI/PrimaryButton"
import DateTimeSelector from "../components/TaskScreenUI/DateTimeSelector"
import { useState } from "react"

export default function AddTaskScreen({ navigation }) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    loading,
    handleAddTask,
  } = useTaskForm(navigation)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const onDateChange = (e, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const newDate = new Date(dueDate)
      newDate.setFullYear(selectedDate.getFullYear())
      newDate.setMonth(selectedDate.getMonth())
      newDate.setDate(selectedDate.getDate())
      setDueDate(newDate)
    }
  }

  const onTimeChange = (e, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newDate = new Date(dueDate)
      newDate.setHours(selectedTime.getHours())
      newDate.setMinutes(selectedTime.getMinutes())
      setDueDate(newDate)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Task Title *</Text>
        <InputField value={title} onChangeText={setTitle} placeholder="Enter task title" />

        <Text style={styles.label}>Description</Text>
        <TextArea value={description} onChangeText={setDescription} placeholder="Optional description" />

        <Text style={styles.label}>Due Date & Time</Text>
        <DateTimeSelector
          dueDate={dueDate}
          setShowDatePicker={setShowDatePicker}
          setShowTimePicker={setShowTimePicker}
          showDatePicker={showDatePicker}
          showTimePicker={showTimePicker}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
        />

        <PrimaryButton onPress={handleAddTask} loading={loading} label="Add Task" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    margin: 15,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
})
