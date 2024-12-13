import React, { useState } from "react";
import { TaskEditProps } from "./types";
import {
  StyledInput,
  StyledButtonSave,
  StyledButtonCancel,
} from "./styles/themes";

const TaskEdit: React.FC<TaskEditProps> = ({ task, onSave, onCancel }) => {
  const [editedText, setEditedText] = useState(task.text);

  const handleSave = () => {
    onSave({ ...task, text: editedText });
  };

  return (
    <div>
      <StyledInput
        type="text"
        value={editedText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedText(e.target.value)}
      />
      <StyledButtonSave onClick={handleSave}>✔</StyledButtonSave>
      <StyledButtonCancel onClick={onCancel}>✘</StyledButtonCancel>
    </div>
  );
};

export default TaskEdit;
