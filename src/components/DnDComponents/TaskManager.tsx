"use client";
import React, { ChangeEvent, useContext, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import AddIcon from "@mui/icons-material/Add";
import TaskItem from "./TaskItem";
import {
  ColumnType,
  headerTitleMapper,
  INIT_TASK_DATA,
  mockDataTask,
  Task,
} from "./types";
import Placeholder from "./Placeholder";
import TaskForm from "./TaskForm";
import { SelectChangeEvent } from "@mui/material";
import moment from "moment";
import Modal from "../Modal";
import { ModalContext } from "@/src/providers/ModalProvider";
import { createTask, updateTask } from "@/src/app/actions";
import { useParams } from "next/navigation";

function TaskManager({tasksData}) {

  
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [taskData, setTaskData] = useState<Task>(INIT_TASK_DATA);
  const { openModal, closeModal } = useContext(ModalContext);
  const params = useParams()
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null); // Clear overlay

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a placeholder
    if (over.id.toString().endsWith("-placeholder")) {
      const targetField = over.id.toString().split("-")[0] as ColumnType; // Extract the column field from the placeholder ID
      setTasks((prev) =>
        prev.map((task) =>
          task.id === active.id ? { ...task, field: targetField } : task
        )
      );
      await onSubmitEditProjectData({ ...activeTask, field: targetField });
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

      updatedColumnTasks.forEach( async (taskItem: Task) => {
        taskItem && await onSubmitEditProjectData(taskItem);
      })
    } else {
      // Move between columns
      setTasks((prev) =>
        prev.map((task) =>
          task.id === active.id ? { ...task, field: overTask.field } : task
        )
      );
      await onSubmitEditProjectData({ ...activeTask, field: overTask.field });

    }
  };
  
  const onOpenModal = (tsk: Task | ColumnType) => {
    if (typeof tsk === "string") {
      // tsk is of type ColumnType
      setTaskData({ ...INIT_TASK_DATA, field: tsk });
    } else {
      // tsk is of type Task
      setTaskData(tsk);
    }
    openModal();
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLSelectElement>
      | SelectChangeEvent
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let timestamp;
    if (e.target.name === "starting_date" || e.target.name === "ending_date") {
      timestamp = moment(e.target.value).utc().valueOf();
    }
    
    setTaskData({
      ...taskData,
      [e.target.name]:
        e.target.name === "starting_date" || e.target.name === "ending_date"
          ? timestamp
          : e.target.value,
    });
  };
  
  const onSubmitTaskData = (taskDTO: Task) => {    
    console.log("taskData: ", {...taskDTO, id: tasks.length + 1, project_id: Number(params.taskId)});
    const create = createTask({...taskDTO, id: tasks.length + 1, project_id: Number(params.taskId)})
    console.log("create: ", create);
    
  };

  const onSubmitEditProjectData = async (taskDTO: Task) => {
    try {
      const update = await updateTask(taskDTO);
      console.log("update: ", update);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  return (
    <>
      <Modal styling={"this-is"}>
        <TaskForm
          taskData={taskData}
          handleChange={handleChange}
          onSubmitTaskData={taskData.id > 0 ? onSubmitEditProjectData : onSubmitTaskData}
        />
      </Modal>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => setActiveTaskId(Number(event.active.id))}>
        <div className="task-dnd-space-container">
          {(
            [
              "backlog",
              "todo",
              "inprogress",
              "finished",
            ] as ColumnType[]
          ).map((field) => (
            <div
              className={`outer-task-container section-${field}`}
              key={field}>
              <div className="task-devision-section">
                <span className="task-devision-title">
                  {headerTitleMapper(field)}
                </span>
                <AddIcon onClick={() => onOpenModal(field)} className="add-task-icon pointer-cursor" />
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
                  {tasks.filter((task) => task.field === field).length ===
                    0 && <Placeholder field={field} />}
                  {tasks
                    .filter((task) => task.field === field)
                    .map((task) => (
                      <TaskItem
                        onOpenModal={onOpenModal}
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
            <div className="active-card task-list-section flex-col-between overlay-item">
              {tasks.find((task) => task.id === activeTaskId)?.task_name}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default TaskManager;
