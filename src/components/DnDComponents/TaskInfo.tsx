"use client";
import React, { ChangeEvent, useContext, useState } from "react";
import { statusTitleMapper, Task } from "./types";
import ReplyIcon from "@mui/icons-material/Reply";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { deleteTask, updateTask } from "@/src/app/actions";
import Modal from "../Modal";
import TaskForm from "./TaskForm";
import { SelectChangeEvent } from "@mui/material";
import { ModalContext } from "@/src/providers/ModalProvider";

const TaskInfo = ({ tasksData }) => {
  const [taskData, setTaskData] = useState(tasksData);
  const { openModal, closeModal } = useContext(ModalContext);
  const params = useParams();
  const router = useRouter();
  const onSubmitEditProjectData = async (taskDTO: Task) => {
    try {
      const update = await updateTask(taskDTO);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const onDeleteTaskData = async (taskId: number) => {
    try {
      const deleteTaskData = await deleteTask(taskId, Number(params.projectId));
    } catch (error) {
      console.error("Error updating task:", error);
    }
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
  //   const onOpenModal = (tsk: Task) => {
  //       // tsk is of type Task
  //       setTaskData(tsk);
  //     openModal();
  //   };

  return (
    <>
      <Modal>
        <TaskForm
          taskData={taskData}
          handleChange={handleChange}
          onSubmitTaskData={onSubmitEditProjectData}
        />
      </Modal>

      <div className="w-100 h-90 flex-center">
        <div
          className={`card-${taskData.status} task-card-content flex-col-between`}>
          <div className="task-card header-task-section pointer-cursor">
            <div className="flex-between">
              <div>{taskData.task_name}</div>
              <div>{statusTitleMapper(taskData.status)}</div>
            </div>
            <div className="blog-time flex-between">
              <span>
                start:&nbsp;
                {moment(Number(taskData.starting_date))
                  .utc()
                  .format("DD/MM/YYYY")}
              </span>
              <span>
                ends:&nbsp;
                {moment(Number(taskData.ending_date))
                  .utc()
                  .format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="flex-between">
              {/* <Link href={`task-manager/${params.projectId}`}> */}
                <ReplyIcon
                    onClick={() => router.push(`/task-manager/${params.projectId}`)}
                  className="trash-icon pointer-cursor"
                />
              {/* </Link> */}
              <div>
                <DeleteForeverIcon
                  onClick={() => onDeleteTaskData(taskData.id).then(() => {router.push(`/task-manager/${params.projectId}`)})}
                  className="trash-icon pointer-cursor"
                />
                <EditNoteIcon
                  className="active-icon pointer-cursor"
                  onClick={openModal}
                />
              </div>
            </div>
          </div>
          <div className="description-taskData-section flex-center-start pointer-cursor">
            {taskData.description}
          </div>
          <hr />
          <div className="taskData-info ">{taskData.info}</div>
        </div>
      </div>
    </>
  );
};

export default TaskInfo;
