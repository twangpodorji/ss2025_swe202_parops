import { createContext, useState } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => setTasks([...tasks, task]);
  const deleteTask = (taskId) =>
    setTasks(tasks.filter((task) => task.id !== taskId));
  const updateTask = (updatedTask) =>
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};
