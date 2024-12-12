import { makeAutoObservable } from "mobx";
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
            const savedTasks = localStorage.getItem("tasks");
            let updatedTasks: TaskItem[] = [];

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
                    this.message = "❗Tasks loaded from server❗";
                } catch (error) {
                    console.error("Error parsing saved tasks:", error);
                    updatedTasks = fetchedTasks;
                    this.message = "❗Error parsing saved tasks. Tasks loaded from server❗";
                }
            } else {
                updatedTasks = fetchedTasks;
                this.message = "❗Tasks loaded from server❗";
            }

            saveTasksToLocalStorage(updatedTasks);
            this.tasks = updatedTasks;
        } catch (error) {
            console.error("Error fetching tasks:", error);
            this.tasks = getTasksFromLocalStorage();
            this.message = "❗Error loading tasks. Tasks loaded from local storage❗";
        };
    }
    


    addTask() {
        if (!this.newTaskText.trim()) return;

        const newTask: TaskItem = {
            id: Date.now(),
            text: this.newTaskText,
            completed: false,
        };

        this.tasks.push(newTask);
        saveTasksToLocalStorage(this.tasks);
        this.newTaskText = "";
    }

    deleteTask(id: number) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        saveTasksToLocalStorage(this.tasks);
    }

    toggleTask(id: number) {
        const taskIndex = this.tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
            saveTasksToLocalStorage(this.tasks);
        }
    }


    markAllCompleted() {
        this.tasks = this.tasks.map((task) => ({ ...task, completed: true }));
        saveTasksToLocalStorage(this.tasks);
    }

    deleteCompleted() {
        this.tasks = this.tasks.filter((task) => !task.completed);
        saveTasksToLocalStorage(this.tasks);
    }

    startEditingTask(task: TaskItem) {
        this.editingTask = task;
    }

    cancelEditingTask() {
        this.editingTask = null;
    }

    updateTask(updatedTask: TaskItem) {
        if (updatedTask.text.trim() === "") return;

        const taskIndex = this.tasks.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
            saveTasksToLocalStorage(this.tasks);
        }

        this.editingTask = null;
    }

    setNewTaskText(text: string) {
        this.newTaskText = text;
    }


}


export default new TodoStore();