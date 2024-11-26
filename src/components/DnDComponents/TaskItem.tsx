import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import moment from "moment";
import { ColumnType, statusTitleMapper, Task } from "./types";
import KitesurfingIcon from "@mui/icons-material/Kitesurfing";
import { useParams } from "next/navigation";
import Link from "next/link";

function TaskItem({
  task,
  isDragging,
  onDeleteTaskData,
  onOpenModal,
}: {
  task: Task;
  isDragging: boolean;
  onDeleteTaskData: (tskId: number) => void;
  onOpenModal: (tsk: Task | ColumnType) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });
  const params = useParams();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto", // Bring dragged item to the front
    backgroundColor: isDragging ? "rgba(255, 255, 255, 0.4)" : "", // Highlight dragged item
  };

  return (
    <div
      style={style}
      className={`card-${task.status} task-list-section flex-col-between`}>
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        className="header-task-section pointer-cursor">
        <div className="flex-between">
          <div>{task.task_name}</div>
          <div>{statusTitleMapper(task.status)}</div>
        </div>
        <div className="blog-time flex-between">
          <span>
            start:{" "}
            {moment(Number(task.starting_date)).utc().format("DD/MM/YYYY")}
          </span>
          <span>
            ends: {moment(Number(task.ending_date)).utc().format("DD/MM/YYYY")}
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
        <DeleteForeverIcon
          onClick={() => onDeleteTaskData(task.id)}
          className="trash-icon pointer-cursor"
        />
        <div>
          <EditNoteIcon
            className="active-icon pointer-cursor"
            onClick={() => onOpenModal(task)}
          />
          <Link href={`/task-manager/${params.projectId}/${task.id}`}>
            <KitesurfingIcon
              className="active-icon pointer-cursor"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
