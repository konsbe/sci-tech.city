import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import moment from "moment";
import { ColumnType, Task } from "./types";

function TaskItem({
  task,
  isDragging,
  onOpenModal,
}: {
  task: Task;
  isDragging: boolean;
  onOpenModal: (tsk: Task | ColumnType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto", // Bring dragged item to the front
    backgroundColor: isDragging ? "#f0f8ff" : "", // Highlight dragged item
  };

  return (
    <div style={style} className="task-list-section flex-col-between">
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        className="header-task-section pointer-cursor">
        <div className="flex-between">
          <div>{task.taskName}</div>
          <div>{task.status}</div>
        </div>
        <div className="blog-time flex-between">
          <span>
            start: {moment(task.starting_date).utc().format("DD/MM/YYYY")}
          </span>
          <span>
            ends: {moment(task.ending_date).utc().format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="description-task-section flex-center-start pointer-cursor">
        {task.description}
      </div>
      <div className="flex-between">
        <DeleteForeverIcon className="pointer-cursor" />
        <EditNoteIcon
          className="pointer-cursor"
          onClick={() => onOpenModal(task)}
        />
      </div>
    </div>
  );
}

export default TaskItem;
