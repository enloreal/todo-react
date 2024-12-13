import { TaskItem } from "./types";

const API_URL = "http://localhost:1337/api/tasks";

export async function fetchTasks(): Promise<TaskItem[]> {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.data.map((item: any) => ({
      id: item.id,
      text: item.text,
      completed: item.completed,
      documentId: item.documentId,
    }));
  } catch (error: any) {
    console.error("Error while fetching tasks:");
    throw new Error("Failed to fetch tasks. Please try again later.");
  }
}

export async function handleAddTask(taskText: string): Promise<TaskItem> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          text: taskText,
          completed: false,
        },
      }),
    });
const newTask = await response.json();
return {
  id: newTask.data.id,
  documentId: newTask.data.documentId,
  text: newTask.data.text,
  completed: newTask.data.completed,
};
  } catch (error: any) {
    console.error("Error adding task:");
    throw new Error("Failed to add task. Please try again later.");
  }
}

export async function handleDeleteTask(documentId: string): Promise<void> {
  try {
      await fetch(`${API_URL}/${documentId}`, {
          method: "DELETE",
      });
  } catch (error: any) {
      console.error("Error deleting task:");
      throw new Error("Failed to delete task. Please try again later.");
  }
}

export async function updateTask(documentId: string, completed: boolean, text: string): Promise<void> {
  try {
    await fetch(`${API_URL}/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          text,
          completed,
        },
      }),
    });
  } catch (error: any) {
    console.error("Error updating task:");
    throw new Error("Failed to update task. Please try again later.");
  }
}
