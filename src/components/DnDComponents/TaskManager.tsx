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
import { ColumnType, headerTitleMapper, INIT_TASK_DATA, Task } from "./types";
import Placeholder from "./Placeholder";
import TaskForm from "./TaskForm";
import { SelectChangeEvent } from "@mui/material";
import moment from "moment";
import Modal from "../Modal";
import { ModalContext } from "@/src/providers/ModalProvider";
import {
  createTask,
  deleteTask,
  GetProjectsTasksResponse,
  updateTask,
} from "@/src/app/actions";
import { useParams } from "next/navigation";
import { isErrorResponse } from "@/src/utils/authentication";

function TaskManager({ tasksData }: { tasksData: GetProjectsTasksResponse }) {
  const [tasks, setTasks] = useState<GetProjectsTasksResponse>(tasksData);
  const [dummyTasks, setDummyTasks] = useState<Task[] | []>([]);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [taskData, setTaskData] = useState<Task>(INIT_TASK_DATA);
  const { openModal, closeModal } = useContext(ModalContext);
  const params = useParams();

  const handleDragEndDummyData = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null); // Clear overlay

    if (!over) return;
    const activeTask = dummyTasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a placeholder
    if (over.id.toString().endsWith("-placeholder")) {
      const targetField = over.id.toString().split("-")[0] as ColumnType; // Extract the column field from the placeholder ID
      setDummyTasks((prev) => {
        if (!Array.isArray(prev)) return prev; // Guard for type safety
        return prev.map((task) =>
          task.id === active.id ? { ...task, field: targetField } : task
        );
      });
      return;
    }

    const overTask = dummyTasks.find((task) => task.id === over.id);
    if (!overTask) return;

    if (activeTask.field === overTask.field) {
      // Reorder within the same column
      const columnTasks = dummyTasks.filter(
        (task) => task.field === activeTask.field
      );
      const otherTasks = dummyTasks.filter(
        (task) => task.field !== activeTask.field
      );

      const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
      const newIndex = columnTasks.findIndex((task) => task.id === over.id);

      const updatedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
      setDummyTasks([...updatedColumnTasks, ...otherTasks]);

      // Update the backend for each task in the reordered column
    } else {
      // Move between columns

      setDummyTasks((prev) => {
        return prev.map((task) =>
          task.id === active.id ? { ...task, field: overTask.field } : task
        );
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null); // Clear overlay

    if (!over) return;
    if (isErrorResponse(tasksData)) {
      await handleDragEndDummyData(event);
      return;
    }
    if (!Array.isArray(tasks) || !tasks) {
      return;
    }

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a placeholder
    if (over.id.toString().endsWith("-placeholder")) {
      const targetField = over.id.toString().split("-")[0] as ColumnType; // Extract the column field from the placeholder ID
      setTasks((prev) => {
        if (!Array.isArray(prev)) return prev; // Guard for type safety
        return prev.map((task) =>
          task.id === active.id ? { ...task, field: targetField } : task
        );
      });
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

      // Update the backend for each task in the reordered column
      for (let i = 0; i < [...updatedColumnTasks, ...otherTasks].length; i++) {
        await onSubmitEditProjectData(
          [...updatedColumnTasks, ...otherTasks][i]
        );
      }
    } else {
      // Move between columns

      setTasks((prev) => {
        if (!Array.isArray(prev)) return prev; // Guard for type safety

        return prev.map((task) =>
          task.id === active.id ? { ...task, field: overTask.field } : task
        );
      });
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
    if (isErrorResponse(tasksData)) {
      //  --Create dummy data for no Auth Users
      setDummyTasks([
        ...dummyTasks,
        {
          ...taskDTO,
          id: (Array.isArray(tasks) ? tasks.length : 0) + 1,
          project_id: Number(params.projectId),
        },
      ]);
    } else {
      //  --Create data for Auth Users
      const create = createTask({
        ...taskDTO,
        id: (Array.isArray(tasks) ? tasks.length : 0) + 1,
        project_id: Number(params.projectId),
      });
    }
  };

  const onSubmitEditProjectData = async (taskDTO: Task) => {
    //  --Update data for Auth Users
    try {
      const update = await updateTask(taskDTO);
    } catch (error) {
      console.error("Error updating task:", error);
    }

    //  --Update dummy data for no Auth Users
    // setDummyTasks((prevTasks) => {
    //   // Find the index of the task to update
    //   const taskIndex = prevTasks.findIndex((task) => task.id === taskDTO.id);

    //   // If task is found, update it; otherwise, return the original array
    //   if (taskIndex !== -1) {
    //     const updatedTasks = [...prevTasks]; // Make a copy of the current tasks array
    //     updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...taskDTO }; // Merge the new task data
    //     return updatedTasks; // Return the updated tasks array
    //   }

    //   // If task is not found, just return the original tasks array
    //   return prevTasks;
    // });
  };

  const onSubmitDeleteProjectData = async (taskId: number) => {
    try {
      const deleteTaskData = await deleteTask(taskId, Number(params.projectId));
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
          onSubmitTaskData={
            taskData.id > 0 ? onSubmitEditProjectData : onSubmitTaskData
          }
        />
      </Modal>
      {Array.isArray(tasks) ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => setActiveTaskId(Number(event.active.id))}>
          <div className="task-dnd-space-container">
            {(
              ["backlog", "todo", "inprogress", "finished"] as ColumnType[]
            ).map((field) => (
              <div
                className={`outer-task-container section-${field}`}
                key={field}>
                <div className="task-devision-section">
                  <span className="task-devision-title">
                    {headerTitleMapper(field)}
                  </span>
                  <AddIcon
                    onClick={() => onOpenModal(field)}
                    className="add-task-icon pointer-cursor"
                  />
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
                          onDeleteTaskData={onSubmitDeleteProjectData}
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
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => setActiveTaskId(Number(event.active.id))}>
          <div className="task-dnd-space-container">
            {(
              ["backlog", "todo", "inprogress", "finished"] as ColumnType[]
            ).map((field) => (
              <div
                className={`outer-task-container section-${field}`}
                key={field}>
                <div className="task-devision-section">
                  <span className="task-devision-title">
                    {headerTitleMapper(field)}
                  </span>
                  <AddIcon
                    onClick={() => onOpenModal(field)}
                    className="add-task-icon pointer-cursor"
                  />
                </div>
                <SortableContext
                  items={[
                    ...dummyTasks
                      .filter((task) => task.field === field)
                      .map((task) => task.id),
                    `${field}-placeholder`, // Add a placeholder ID for the empty column
                  ]}
                  strategy={verticalListSortingStrategy}>
                  <div className="task-section">
                    {dummyTasks.filter((task) => task.field === field)
                      .length === 0 && <Placeholder field={field} />}
                    {dummyTasks
                      .filter((task) => task.field === field)
                      .map((task) => (
                        <TaskItem
                          onDeleteTaskData={onSubmitDeleteProjectData}
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
                {dummyTasks.find((task) => task.id === activeTaskId)?.task_name}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </>
  );
}

export default TaskManager;
