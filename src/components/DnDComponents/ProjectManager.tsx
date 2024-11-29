"use client";
import React, { ChangeEvent, useContext, useState } from "react";
import { INIT_PROJECT_DATA, ProjectType } from "./types";
import AddIcon from "@mui/icons-material/Add";
import { ModalContext } from "@/src/providers/ModalProvider";
import Modal from "@/src/components/Modal";
import { SelectChangeEvent } from "@mui/material";
import moment from "moment";
import {
  createProject,
  deleteProject,
  GetProjectsResponse,
  updateProject,
} from "@/src/app/actions";
import { useRouter } from "next/navigation";
import ProjectItem from "./ProjectItem";
import ProjectForm from "./ProjectForm";
import { isErrorResponse, unauthorizedErrorCode } from "@/src/utils/authentication";
import CustomTooltip from "../Tooltip/Tooltip";

function ProjectManager({ projects }: { projects: GetProjectsResponse }) {
  const [projectData, setProjectData] = useState(INIT_PROJECT_DATA);
  const [dummyProjects, setDummyProjects] = useState<any>([]);
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
    if (isErrorResponse(projects)) {
      //  --Create Dummy Data for no Auth Users
      setDummyProjects([
        ...dummyProjects,
        {
          ...projectData,
          id: (Array.isArray(projects) ? projects.length : 0) + 1,
        },
      ]);
    } else {
      //  --Create data for Auth Users
      const create = await createProject({
        ...projectData,
        id: (Array.isArray(projects) ? projects.length : 0) + 1,
      });
    }
  };

  const onSubmitEditProjectData = async () => {
    if (isErrorResponse(projects)) {
      //  --Update dummy data for no Auth Users
      setDummyProjects((prevProject: ProjectType[]) => {
        // Find the index of the task to update
        const taskIndex = prevProject.findIndex(
          (project) => project.id === projectData.id
        );

        // If task is found, update it; otherwise, return the original array
        if (taskIndex !== -1) {
          const updatedTasks = [...prevProject]; // Make a copy of the current tasks array
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            ...projectData,
          }; // Merge the new task data
          return updatedTasks; // Return the updated tasks array
        }

        // If task is not found, just return the original tasks array
        return prevProject;
      });
    } else {
      //  --Update data for Auth Users
      const update = await updateProject({ ...projectData });
    }
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
        <>
          <CustomTooltip tooltipContent={isErrorResponse(projects) ? unauthorizedErrorCode.message : null}>
            <div
              className="card add-card flex-center pointer-cursor"
              onClick={() => onOpenModal(null)}>
              <AddIcon className="add-icon" fontSize="large" />
            </div>
          </CustomTooltip>
        </>

        {Array.isArray(projects)
          ? projects.map((project: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`card card-${project.status}  flex-col-between`}>
                  <ProjectItem
                    project={project}
                    onDeleteProjectData={onSubmitDeleteProjectData}
                    onOpenModal={onOpenModal}
                  />
                </div>
              );
            })
          : dummyProjects.map((project: any, index: number) => {
              return (
                <>
                  <CustomTooltip
                    tooltipContent={isErrorResponse(projects) ? null : ""}>
                    <div
                      key={index}
                      className={`card card-${project.status}  flex-col-between`}>
                      <ProjectItem
                        project={project}
                        onDeleteProjectData={onSubmitDeleteProjectData}
                        onOpenModal={onOpenModal}
                      />
                    </div>
                  </CustomTooltip>
                </>
              );
            })}
      </div>
    </>
  );
}

export default ProjectManager;
