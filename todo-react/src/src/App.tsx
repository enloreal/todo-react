import React, { useState, useEffect, ChangeEvent } from "react";
import Task from "./Task";
import { TaskItem } from "./types";
import { fetchTasks, handleAddTask } from "./api";
import { StyledButton } from "./styles/themes";
import { ThemeProvider } from "styled-components";
import TaskEdit from "./TaskEdit";
import {
  darkTheme,
  lightTheme,
  MainContainer,
  StyledInput,
  StyledInputContainer,
  FunctionalTitle,
  ControlButton,
  StyledButtonThemes,
  ErrorMessage,
} from "./styles/themes";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    try {
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Error parsing saved tasks:", error);
      return [];
    }
  });

  const [newTaskText, setNewTaskText] = useState<string>("");
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(
    "❗Tasks loaded from local storage❗"
  );

  const saveTasksToLocalStorage = (tasks: TaskItem[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveEdit = (updatedTask: TaskItem) => {
    if (updatedTask.text.trim() === "") {
      setEditingTask(null);
      return;
    }

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });

    setEditingTask(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTasks = await fetchTasks();
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
            setErrorMessage("❗Tasks loaded from server❗");
          } catch (error) {
            console.error("Error parsing saved tasks:", error);
            updatedTasks = fetchedTasks;
          }
        } else {
          updatedTasks = fetchedTasks;
        }

        setTasks(updatedTasks);
        saveTasksToLocalStorage(updatedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(event.target.value);
  };

  const addTask = async () => {
    if (newTaskText.trim()) {
      try {
        const newTask = await handleAddTask(newTaskText);
        setTasks((prevTasks) => {
          const updatedTasks = [...prevTasks, newTask];
          saveTasksToLocalStorage(updatedTasks);
          return updatedTasks;
        });
        setNewTaskText("");
      } catch (error) {
        console.error("Error while adding the task:", error);
      }
    }
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== id);
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const toggleTask = (id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const markAllCompleted = () => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => ({
        ...task,
        completed: true,
      }));
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const deleteCompleted = () => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => !task.completed);
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    });
  };

  const [theme, setTheme] = useState("light");

  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <MainContainer>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <StyledButtonThemes onClick={switchTheme}>☀️🌙</StyledButtonThemes>
        <FunctionalTitle>with functional components</FunctionalTitle>
        <h1>Task Manager</h1>
        <ControlButton onClick={markAllCompleted}>
          Mark All Completed
        </ControlButton>
        <ControlButton onClick={deleteCompleted}>
          Delete Completed
        </ControlButton>

        <StyledInputContainer>
          <StyledInput
            type="text"
            placeholder="Enter task"
            value={newTaskText}
            onChange={handleInputChange}
          />
          <StyledButton onClick={addTask}>Add</StyledButton>
        </StyledInputContainer>
        {editingTask ? (
          <TaskEdit
            task={editingTask}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        ) : (
          tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onEdit={handleEditTask}
            />
          ))
        )}
      </MainContainer>
    </ThemeProvider>
  );
};

export default App;
