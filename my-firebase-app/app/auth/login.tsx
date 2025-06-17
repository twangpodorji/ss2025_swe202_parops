// import React, { useState } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   KeyboardAvoidingView,
//   TextInput,
//   Button,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import auth from "@react-native-firebase/auth"; // Correct import for Firebase Auth

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const signUp = async () => {
//     setLoading(true);
//     try {
//       await auth().createUserWithEmailAndPassword(email, password);
//       Alert.alert(
//         "Success",
//         "Account created successfully! Check your emails."
//       );
//     } catch (error: unknown) {
//       let errorMessage = "An unknown error occurred during registration.";

//       // Check if error is an instance of Error
//       if (error instanceof Error) {
//         errorMessage = error.message; // Safely access the message property
//       } else if (
//         typeof error === "object" &&
//         error !== null &&
//         "message" in error
//       ) {
//         // Handle cases where error might be a Firebase-specific error object
//         errorMessage = (error as { message: string }).message;
//       }

//       Alert.alert("Registration failed", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       await auth().signInWithEmailAndPassword(email, password);
//       Alert.alert("Success", "You are now logged in!");
//     } catch (error: unknown) {
//       let errorMessage = "An unknown error occurred during login.";

//       // Check if error is an instance of Error
//       if (error instanceof Error) {
//         errorMessage = error.message; // Safely access the message property
//       } else if (
//         typeof error === "object" &&
//         error !== null &&
//         "message" in error
//       ) {
//         // Handle cases where error might be a Firebase-specific error object
//         errorMessage = (error as { message: string }).message;
//       }

//       Alert.alert("Sign in failed", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <KeyboardAvoidingView behavior="padding">
//         <TextInput
//           style={styles.input}
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//           keyboardType="email-address"
//           placeholder="Email"
//         />
//         <TextInput
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           placeholder="Password"
//         />
//         {loading ? (
//           <ActivityIndicator size="small" style={{ margin: 28 }} />
//         ) : (
//           <>
//             <Button onPress={signIn} title="Login" />
//             <Button onPress={signUp} title="Create account" />
//           </>
//         )}
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 20,
//     flex: 1,
//     justifyContent: "center",
//   },
//   input: {
//     marginVertical: 4,
//     height: 50,
//     borderWidth: 1,
//     borderRadius: 4,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
// });
