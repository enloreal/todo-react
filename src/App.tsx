import React, { useState, useEffect, ChangeEvent, createContext, useContext } from "react";
import Task from "./Task";
import { TaskItem } from "./types";
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
  StyledButton,
} from "./styles/themes";
import { observer } from "mobx-react-lite";
import todoStore from "./store/todoStore";


export const StoreContext = createContext({} as { todoStore: typeof todoStore });

export const useStore = () => useContext(StoreContext);


const App: React.FC = observer(() => {
  const { todoStore } = useStore();

  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTasks = async () => {
      setIsLoading(true);
      await todoStore.fetchInitialTasks();
      setIsLoading(false);
    };

    initializeTasks();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    todoStore.setNewTaskText(event.target.value);
  };

  const addTask = () => {
    todoStore.addTask();
  };

  const deleteTask = (id: number) => {
    todoStore.deleteTask(id);
  };

  const toggleTask = (id: number) => {
    todoStore.toggleTask(id);
  };

  const markAllCompleted = () => {
    todoStore.markAllCompleted();
  };

  const deleteCompleted = () => {
    todoStore.deleteCompleted();
  };

  const handleEditTask = (task: TaskItem) => {
    todoStore.startEditingTask(task);
  };

  const handleCancelEdit = () => {
    todoStore.cancelEditingTask();
  };

  const handleSaveEdit = (updatedTask: TaskItem) => {
    todoStore.updateTaskInStore(updatedTask);
  };


  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <MainContainer>

        <StyledButtonThemes onClick={switchTheme}>☀️🌙</StyledButtonThemes>
        <FunctionalTitle>with functional components(MobX)</FunctionalTitle>
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
            value={todoStore.newTaskText} 
            onChange={handleInputChange}
          />
          <StyledButton onClick={addTask}>Add</StyledButton>
        </StyledInputContainer>
        {isLoading ? (
          <div>Loading tasks...⏳</div>
        ) : (
          <>
            {todoStore.editingTask ? ( 
              <TaskEdit
                task={todoStore.editingTask} 
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              todoStore.tasks.map((task) => ( 
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
});


export default App;
