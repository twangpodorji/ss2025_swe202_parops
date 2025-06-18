import { TextInput, StyleSheet } from "react-native"

export default function InputField({ value, onChangeText, placeholder }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
})
