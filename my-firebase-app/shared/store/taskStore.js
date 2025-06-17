import { create } from "zustand";
import { TaskService } from "../services/service";

/**
 * Task Store
 * Manages task-related state using Zustand
 */
export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split("T")[0],

  // Actions
  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  // Task operations
  createTask: async (taskData) => {
    set({ loading: true, error: null });
    const result = await TaskService.createTask(taskData);
    if (result.success) {
      // Task will be updated via real-time listener
      set({ loading: false });
      return result;
    } else {
      set({ loading: false, error: result.error });
      return result;
    }
  },

  updateTask: async (taskId, taskData) => {
    set({ loading: true, error: null });
    const result = await TaskService.updateTask(taskId, taskData);
    if (result.success) {
      set({ loading: false });
      return result;
    } else {
      set({ loading: false, error: result.error });
      return result;
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    const result = await TaskService.deleteTask(taskId);
    if (result.success) {
      set({ loading: false });
      return result;
    } else {
      set({ loading: false, error: result.error });
      return result;
    }
  },

  // Get tasks for specific date
  getTasksForDate: (date) => {
    const { tasks } = get();
    return tasks.filter(
      (task) => task.scheduledDate && task.scheduledDate.startsWith(date)
    );
  },

  // Subscribe to real-time updates
  subscribeToTasks: (userId) => {
    return TaskService.subscribeToUserTasks(userId, (tasks) => {
      set({ tasks });
    });
  },
}));

/**
 * Auth Store
 * Manages authentication state
 */
export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
