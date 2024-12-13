import { makeAutoObservable } from "mobx";
import { TaskItem } from "../types";
import { handleDeleteTask, updateTask, handleAddTask, fetchTasks as apiFetchTasks } from "../api";

class TodoStore {
    tasks: TaskItem[] = [];
    newTaskText: string = "";
    editingTask: TaskItem | null = null;
    message: string = "";
    
    constructor() {
        makeAutoObservable(this);
    }

    async fetchInitialTasks() {
        try {
            const fetchedTasks = await apiFetchTasks();
            this.tasks = fetchedTasks;
            this.message = "❗Tasks loaded from server❗";
        } catch (error) {
            console.error("Error fetching tasks:", error);
            this.message = "❗Error loading tasks❗";
        }
    }

    addTask() {
        if (!this.newTaskText.trim()) return;

        handleAddTask(this.newTaskText).then((newTask) => {
            this.tasks.push(newTask);
            this.newTaskText = "";
        });
    }

    async deleteTask(id: number) {
        const task = this.tasks.find((task) => task.id === id);
        if (task) {
            await handleDeleteTask(task.documentId);
            this.tasks = this.tasks.filter((task) => task.id !== id);
        }
    }

    async toggleTask(id: number) {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            const updatedTask = this.tasks[taskIndex];
            await updateTask(
                updatedTask.documentId,
                !updatedTask.completed,
                updatedTask.text
            );
            this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
        }
    }

    markAllCompleted() {
        this.tasks.forEach((task) => {
          if (!task.completed) {
            updateTask(task.documentId, true, task.text);
          }
        });
        this.tasks = this.tasks.map((task) => ({ ...task, completed: true }));
      }

    deleteCompleted() {
        this.tasks.filter((task) => task.completed).forEach((task) => {
          handleDeleteTask(task.documentId);
        });
        this.tasks = this.tasks.filter((task) => !task.completed);
      }
    

    startEditingTask(task: TaskItem) {
        this.editingTask = task;
    }

    cancelEditingTask() {
        this.editingTask = null;
    }

    updateTaskInStore(updatedTask: TaskItem) {
        if (updatedTask.text.trim() === "") return;
      
        const taskIndex = this.tasks.findIndex((task) => task.documentId === updatedTask.documentId);
        if (taskIndex !== -1) {
            updateTask(updatedTask.documentId, updatedTask.completed, updatedTask.text).then(() => {
                this.tasks[taskIndex] = updatedTask;
            });
        }
      
        this.editingTask = null;
    }
      
    setNewTaskText(text: string) {
        this.newTaskText = text;
    }
}

export default new TodoStore();