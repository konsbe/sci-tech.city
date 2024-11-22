"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./taskManager.css";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import moment from "moment";

type Task = {
  id: string;
  field: ColumnType;
  taskName: string;
  startind_date: number;
  ending_date: number;
  status: string;
  description: string;
};

type ColumnType = "backlog" | "todo" | "inprogress" | "test" | "finished";
const headerTitleMapper = (header: string) => {
  return header === "backlog"
    ? "Backlog"
    : header === "todo"
    ? "To do"
    : header === "inprogress"
    ? "In Progress"
    : header === "test"
    ? "Test"
    : "Finished";
};
function TaskItem({ task, isDragging }: { task: Task; isDragging: boolean }) {
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-list-section flex-col-between">
      <div className="header-task-section">
        <div className="flex-between">
          <div>{task.taskName}</div>
          <div>{task.status}</div>
        </div>
        <div className="blog-time flex-between">
          <span>
            start: {moment(task.startind_date).utc().format("DD/MM/YYYY")}
          </span>
          <span>
            ends: {moment(task.ending_date).utc().format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
      <div className="description-task-section flex-center-start">
        {task.description}
      </div>
      <div className="flex-between">
        <DeleteForeverIcon className="pointer-cursor" />
        <EditNoteIcon className="pointer-cursor" />
      </div>
    </div>
  );
}
const allField = ["backlog", "todo"];
function Placeholder({ field }: { field: ColumnType }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${field}-placeholder`,
  });

  return (
    <div
      id={`${field}-placeholder`}
      ref={setNodeRef}
      className={`placeholder ${isOver ? "highlight-droppable" : ""}`}>
      This list is empty
    </div>
  );
}
function Task() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      field: "backlog",
      taskName: "Backlog Task 1",
      startind_date: 1732143600000,
      ending_date: 1732143600000,
      status: "todo",
      description: "Task description",
    },
    {
      id: "2",
      field: "backlog",
      taskName: "Backlog Task 2",
      startind_date: 1732143600000,
      ending_date: 1732143600000,
      status: "todo",
      description: "Task description",
    },
    {
      id: "3",
      field: "todo",
      taskName: "To Do Task 1",
      startind_date: 1732143600000,
      ending_date: 1732143600000,
      status: "todo",
      description: "Task description",
    },
    {
      id: "4",
      field: "finished",
      taskName: "To Do Task 1",
      startind_date: 1732143600000,
      ending_date: 1732143600000,
      status: "todo",
      description: "Task description",
    },
  ]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null); // Clear overlay
    console.log("active: ", active);
    console.log("over: ", over);

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a placeholder
    if (over.id.endsWith("-placeholder")) {
      const targetField = over.id.split("-")[0] as ColumnType; // Extract the column field from the placeholder ID
      setTasks((prev) =>
        prev.map((task) =>
          task.id === active.id ? { ...task, field: targetField } : task
        )
      );
      return;
    }

    const overTask = tasks.find((task) => task.id === over.id);
    if (!overTask) return;

    if (activeTask.field === overTask.field) {
      // Reorder within the same column
      const columnTasks = tasks.filter(
        (task) => task.field === activeTask.field
      );
      const otherTasks = tasks.filter(
        (task) => task.field !== activeTask.field
      );

      const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
      const newIndex = columnTasks.findIndex((task) => task.id === over.id);

      const updatedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
      setTasks([...updatedColumnTasks, ...otherTasks]);
    } else {
      // Move between columns
      setTasks((prev) =>
        prev.map((task) =>
          task.id === active.id ? { ...task, field: overTask.field } : task
        )
      );
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => setActiveTaskId(event.active.id)}>
      <div className="task-dnd-space-container">
        {(
          ["backlog", "todo", "inprogress", "test", "finished"] as ColumnType[]
        ).map((field) => (
          <div className={`outer-task-container section-${field}`} key={field}>
            <div className="task-devision-section">
              <span className="task-devision-title">
                {headerTitleMapper(field)}
              </span>
              <AddIcon className="add-icon pointer-cursor" />
            </div>
            <SortableContext
              items={[
                ...tasks
                  .filter((task) => task.field === field)
                  .map((task) => task.id),
                `${field}-placeholder`, // Add a placeholder ID for the empty column
              ]}
              strategy={verticalListSortingStrategy}>
              <div className="task-section">
                {tasks.filter((task) => task.field === field).length === 0 && (
                  <Placeholder field={field} />
                )}
                {tasks
                  .filter((task) => task.field === field)
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isDragging={task.id === activeTaskId}
                    />
                  ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTaskId && (
          <div className="task-list-section flex-col-between overlay-item">
            {tasks.find((task) => task.id === activeTaskId)?.taskName}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default Task;
