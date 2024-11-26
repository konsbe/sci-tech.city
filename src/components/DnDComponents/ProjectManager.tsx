"use client";
import React, { ChangeEvent, useContext, useState } from "react";
import { INIT_PROJECT_DATA, ProjectType } from "./types";
import AddIcon from "@mui/icons-material/Add";
import { ModalContext } from "@/src/providers/ModalProvider";
import Modal from "@/src/components/Modal";
import { SelectChangeEvent } from "@mui/material";
import moment from "moment";
import { createProject, deleteProject, updateProject } from "@/src/app/actions";
import { useRouter } from "next/navigation";
import ProjectItem from "./ProjectItem";
import ProjectForm from "./ProjectForm";

function ProjectManager({ projects }) {
  const [projectData, setProjectData] = useState(INIT_PROJECT_DATA);
  const { openModal, closeModal } = useContext(ModalContext);
  const router = useRouter();

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
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.name === "date" ? timestamp : e.target.value,
    });
  };

  const onSubmitProjectData = async () => {
    const create = await createProject({
      ...projectData,
      id: (projects.length + 1).toString(),
    });
  };

  const onSubmitEditProjectData = async () => {
    const update = await updateProject({ ...projectData });
  };
  const onSubmitDeleteProjectData = async (project_id: number) => {
    const deletePr = await deleteProject(project_id);
  };

  const onOpenModal = (project: ProjectType | null) => {
    if (project) {
      setProjectData(project);
    } else {
      setProjectData(INIT_PROJECT_DATA);
    }
    openModal();
  };

  return (
    <>
      <Modal modalContainer="task-manager">
        <ProjectForm
          projectData={projectData}
          handleChange={handleChange}
          onSubmitTaskData={
            projectData.id > 0 ? onSubmitEditProjectData : onSubmitProjectData
          }
          closeModal={closeModal}
        />
      </Modal>
      <div className="tasks-container">
        <div
          className="card add-card flex-center pointer-cursor"
          onClick={() => onOpenModal(null)}>
          <AddIcon className="add-icon" fontSize="large" />
        </div>
        {projects &&
          projects.map((project: any, index: number) => {
            return (
              <div key={index} className="card flex-col-between">
                <ProjectItem
                  project={project}
                  onDeleteProjectData={onSubmitDeleteProjectData}
                  onOpenModal={onOpenModal}
                />
              </div>
            );
          })}
      </div>
    </>
  );
}

export default ProjectManager;
