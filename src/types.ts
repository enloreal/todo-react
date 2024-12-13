export interface TaskItem {
  id: number;
  text: string;
  completed: boolean;
  documentId: string;
}

export interface AppState {
  tasks: TaskItem[];
  newTaskText: string;
}

export interface TaskProps {
  task: TaskItem;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (task: TaskItem) => void;
}

export interface TaskEditProps {
  task: TaskItem;
  onSave: (task: TaskItem) => void;
  onCancel: () => void;
}
