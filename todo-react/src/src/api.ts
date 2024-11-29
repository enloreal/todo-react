import { TaskItem } from "./types";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchTasks(): Promise<TaskItem[]> {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      text: item.title,
      completed: item.completed,
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
      body: JSON.stringify({
        title: taskText,
        completed: false,
        userId: 1,
      }),
    });
    const newTask = await response.json();
    return {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
  } catch (error: any) {
    console.error("Error adding task:");
    throw new Error("Failed to add task. Please try again later.");
  }
}

export async function handleDeleteTask(id: number): Promise<void> {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error: any) {
    console.error("Error deleting task:");
    throw new Error("Failed to delete task. Please try again later.");
  }
}

export async function updateTask(
  id: number,
  completed: boolean,
  text: string
): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      id: id,
      title: text,
      completed: completed,
      userId: 1,
    }),
  });
}
