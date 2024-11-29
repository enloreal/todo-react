import React, { useState, useEffect, ChangeEvent } from "react";
import Task from "./Task";
import { TaskItem } from "./types";
import { ThemeProvider } from "styled-components";
import TaskEdit from "./TaskEdit";
import {
  fetchInitialTasks,
  addTask as addTaskService,
  deleteTask as deleteTaskService,
  toggleTask as toggleTaskService,
  markAllCompleted as markAllCompletedService,
  deleteCompleted as deleteCompletedService,
  updateTask as updateTaskService,
} from "./services/todoService";
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
  StyledButton,
} from "./styles/themes";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTasks = async () => {
      setIsLoading(true);
      try {
        const { tasks: initialTasks, message } = await fetchInitialTasks();
        setTasks(initialTasks);
        setErrorMessage(message);
      } catch (error) {
        setErrorMessage("❗Error loading tasks❗");
      } finally {
        setIsLoading(false);
      }
    };

    initializeTasks();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTaskText(event.target.value);
  };

  const addTask = () => {
    setTasks((tasks) => addTaskService(tasks, newTaskText));
    setNewTaskText("");
  };

  const deleteTask = (id: number) => {
    setTasks((tasks) => deleteTaskService(tasks, id));
  };

  const toggleTask = (id: number) => {
    setTasks((tasks) => toggleTaskService(tasks, id));
  };

  const markAllCompleted = () => {
    setTasks((tasks) => markAllCompletedService(tasks));
  };

  const deleteCompleted = () => {
    setTasks((tasks) => deleteCompletedService(tasks));
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveEdit = (updatedTask: TaskItem) => {
    setTasks((tasks) => updateTaskService(tasks, updatedTask));
    setEditingTask(null);
  };

  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <MainContainer>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
        {isLoading ? (
          <div>Loading tasks...⏳</div>
        ) : (
          <>
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
          </>
        )}
      </MainContainer>
    </ThemeProvider>
  );
};

export default App;
