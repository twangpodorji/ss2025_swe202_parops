import { TextInput, StyleSheet } from "react-native"

export default function TextArea({ value, onChangeText, placeholder }) {
  return (
    <TextInput
      style={styles.textArea}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline
      numberOfLines={4}
    />
  )
}

const styles = StyleSheet.create({
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
})
