import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useState } from "react"

export default function TaskForm({
  title,
  description,
  dueDate,
  onChangeTitle,
  onChangeDescription,
  onChangeDueDate,
  onSubmit,
  loading,
  submitLabel = "Submit",
}) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const newDate = new Date(dueDate)
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      onChangeDueDate(newDate)
    }
  }

  const handleTimeChange = (_, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const newDate = new Date(dueDate)
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())
      onChangeDueDate(newDate)
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Task Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={onChangeTitle}
        maxLength={100}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter task description (optional)"
        value={description}
        onChangeText={onChangeDescription}
        multiline
        numberOfLines={4}
        maxLength={500}
      />

      <Text style={styles.label}>Due Date & Time</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateTimeText}>{dueDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.dateTimeText}>
            {dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dueDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? `${submitLabel}ing...` : submitLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  dateTimeButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
