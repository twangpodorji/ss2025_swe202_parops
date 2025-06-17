"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../src/firebase";

interface Note {
  id: string;
  text: string;
  createdAt: any;
  userId: string;
}

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: Note[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          notesData.push({
            id: doc.id,
            ...data,
          } as Note);
        }
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  const addSampleNote = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, "notes"), {
        text: `Sample note created at ${new Date().toLocaleTimeString()}`,
        createdAt: new Date(),
        userId: user.uid,
      });
    } catch (error: any) {
      Alert.alert("Error", "Failed to add note");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome, {user?.displayName || "User"}!
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Notes</Text>

        <TouchableOpacity style={styles.addButton} onPress={addSampleNote}>
          <Text style={styles.addButtonText}>Add Sample Note</Text>
        </TouchableOpacity>

        <ScrollView style={styles.notesList}>
          {notes.length === 0 ? (
            <Text style={styles.emptyText}>
              No notes yet. Add your first note!
            </Text>
          ) : (
            notes.map((note) => (
              <View key={note.id} style={styles.noteItem}>
                <Text style={styles.noteText}>{note.text}</Text>
                <Text style={styles.noteDate}>
                  {note.createdAt?.toDate?.()?.toLocaleDateString() ||
                    "Just now"}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  noteText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 12,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 50,
  },
});
