import { TaskItem } from "../types";
import { fetchTasks as apiFetchTasks } from "../api";

const saveTasksToLocalStorage = (tasks: TaskItem[]): void => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getTasksFromLocalStorage = (): TaskItem[] => {
  const savedTasks = localStorage.getItem("tasks");
  try {
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Error parsing saved tasks:", error);
    return [];
  }
};

export const fetchInitialTasks = async (): Promise<{
  tasks: TaskItem[];
  message: string;
}> => {
  try {
    const fetchedTasks = await apiFetchTasks();
    const savedTasks = localStorage.getItem("tasks");
    let updatedTasks: TaskItem[] = [];
    let message = "❗Tasks loaded from local storage❗";

    if (savedTasks) {
      try {
        const parsedSavedTasks = JSON.parse(savedTasks);
        const allTasks = [...parsedSavedTasks, ...fetchedTasks];
        const uniqueIds = new Set<number>();
        updatedTasks = allTasks.filter((task) => {
          if (!uniqueIds.has(task.id)) {
            uniqueIds.add(task.id);
            return true;
          }
          return false;
        });
        message = "❗Tasks loaded from server❗";
      } catch (error) {
        console.error("Error parsing saved tasks:", error);
        updatedTasks = fetchedTasks;
      }
    } else {
      updatedTasks = fetchedTasks;
    }

    saveTasksToLocalStorage(updatedTasks);
    return { tasks: updatedTasks, message };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      tasks: getTasksFromLocalStorage(),
      message: "❗Tasks loaded from local storage❗",
    };
  }
};

export const addTask = (tasks: TaskItem[], newTaskText: string): TaskItem[] => {
  if (!newTaskText.trim()) return tasks;

  const newTask: TaskItem = {
    id: Date.now(),
    text: newTaskText,
    completed: false,
  };

  const updatedTasks = [...tasks, newTask];
  saveTasksToLocalStorage(updatedTasks);
  return updatedTasks;
};

export const deleteTask = (tasks: TaskItem[], id: number): TaskItem[] => {
  const updatedTasks = tasks.filter((task) => task.id !== id);
  saveTasksToLocalStorage(updatedTasks);
  return updatedTasks;
};

export const toggleTask = (tasks: TaskItem[], id: number): TaskItem[] => {
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasksToLocalStorage(updatedTasks);
  return updatedTasks;
};

export const markAllCompleted = (tasks: TaskItem[]): TaskItem[] => {
  const updatedTasks = tasks.map((task) => ({
    ...task,
    completed: true,
  }));
  saveTasksToLocalStorage(updatedTasks);
  return updatedTasks;
};

export const deleteCompleted = (tasks: TaskItem[]): TaskItem[] => {
  const updatedTasks = tasks.filter((task) => !task.completed);
  saveTasksToLocalStorage(updatedTasks);
  return updatedTasks;
};

export const updateTask = (
  tasks: TaskItem[],
  updatedTask: TaskItem
): TaskItem[] => {
  if (updatedTask.text.trim() === "") return tasks;

  const updatedTasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasksToLocalStorage(updatedTasks);
  return updatedTasks;
};
