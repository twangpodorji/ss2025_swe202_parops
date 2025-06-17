import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../src/firebase";

/**
 * Authentication Service
 * Handles all Firebase authentication operations
 */
export class AuthService {
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Task Service
 * Handles all task-related Firebase operations
 */
export class TaskService {
  static async createTask(taskData) {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        userId: auth.currentUser?.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateTask(taskId, taskData) {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteTask(taskId) {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getUserTasks(userId) {
    try {
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", userId),
        orderBy("scheduledDate", "asc")
      );
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static subscribeToUserTasks(userId, callback) {
    const q = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      orderBy("scheduledDate", "asc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      callback(tasks);
    });
  }
}