import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"

export default function DateTimeSelector({
  dueDate,
  setShowDatePicker,
  setShowTimePicker,
  showDatePicker,
  showTimePicker,
  onDateChange,
  onTimeChange,
}) {
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.text}>{dueDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.text}>
            {dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dueDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  button: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
})
