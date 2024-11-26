"use client";
import React, { ChangeEvent, useContext, useState } from "react";
import { ProjectType, statusTitleMapper, Task } from "./types";
import ReplyIcon from "@mui/icons-material/Reply";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useParams, useRouter } from "next/navigation";
import { deleteProject, updateProject } from "@/src/app/actions";
import Modal from "../Modal";
import TaskForm from "./TaskForm";
import { SelectChangeEvent } from "@mui/material";
import { ModalContext } from "@/src/providers/ModalProvider";
import ProjectForm from "./ProjectForm";

const ProjectInfo = ({ projectData }) => {
  const [projectDataState, setProjectDataState] = useState(projectData);
  const { openModal, closeModal } = useContext(ModalContext);
  const params = useParams();
  const router = useRouter();

  const onSubmitEditProjectData = async (projectDTO: ProjectType) => {
    try {
      const update = await updateProject(projectDTO);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const onDeleteProjectData = async (taskId: number) => {
    try {
      const deleteTaskData = await deleteProject(Number(params.projectId));
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
    if (e.target.name === "date") {
      timestamp = moment(e.target.value).utc().valueOf();
    }
    setProjectDataState({
      ...projectDataState,
      [e.target.name]: e.target.name === "date" ? timestamp : e.target.value,
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
        <ProjectForm
          projectData={projectDataState}
          handleChange={handleChange}
          onSubmitTaskData={onSubmitEditProjectData}
          projectDataRouter={true}
          closeModal={closeModal}
        />
      </Modal>

      <div className="w-100 h-90 flex-center">
        <div
          className={`card-${projectDataState.status} task-card-content flex-col-between`}>
          <div className="task-card header-task-section pointer-cursor">
            <div className="flex-between">
              <div>{projectDataState.project_name}</div>
              <div>{statusTitleMapper(projectDataState.status)}</div>
            </div>
            <div className="blog-time flex-between">
              <span>
                Date:&nbsp;
                {moment(Number(projectDataState.date))
                  .utc()
                  .format("DD/MM/YYYY")}
              </span>
              <span>
                created at:&nbsp;
                {moment(projectDataState.created_at).utc().format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="flex-between">
              {/* <Link href={`task-manager/${params.projectId}`}> */}
              <div>
                <ReplyIcon
                  onClick={() => router.push("/task-manager/")}
                  className="trash-icon pointer-cursor"
                />
                <ReplyIcon
                  onClick={() =>
                    router.push(`/task-manager/${params.projectId}`)
                  }
                  className="rotating-icon pointer-cursor"
                />
              </div>
              {/* </Link> */}
              <div>
                <DeleteForeverIcon
                  onClick={() =>
                    onDeleteProjectData(projectDataState.id).then(() => {
                      router.push("/task-manager/");
                    })
                  }
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
            {projectDataState.description}
          </div>
          <hr />
          <div className="taskData-info ">{projectDataState.info}</div>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
