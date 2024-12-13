import React from "react";
import { TaskProps } from "./types";
import { TaskCheckBox, StyledButton } from "./styles/themes";
import { observer } from "mobx-react-lite";

const Task: React.FC<TaskProps> = observer(({ task, onDelete, onToggle, onEdit }) => {
  return (
    <div style={{ textDecoration: task.completed ? "line-through" : "none" }}>
      <TaskCheckBox
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      {task.text}
      <StyledButton onClick={() => onEdit(task)}>✍️</StyledButton>
      <StyledButton onClick={() => onDelete(task.id)}>Delete</StyledButton>
    </div>
  );
});

export default Task;