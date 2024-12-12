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
import ProjectItem from "./ProjectItem";
import ProjectForm from "./ProjectForm";
import {
  isErrorResponse,
  unauthorizedErrorCode,
} from "@/src/utils/authentication";
import CustomTooltip from "../Tooltip/Tooltip";
import { orderFunc } from "@/src/utils/utilitiesFuncs";

function ProjectManager({ projects }: { projects: GetProjectsResponse }) {
  const [projectData, setProjectData] = useState(INIT_PROJECT_DATA);
  const [orderBy, setOrderBy] = useState({orderer: "", asc: false});
  const [dummyProjects, setDummyProjects] = useState<any>([]);
  const { openModal, closeModal } = useContext(ModalContext);

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
  const handleOrder = (orderVar: string) => {
    setOrderBy({orderer: orderVar, asc: orderBy.orderer === orderVar ? !orderBy.asc : true})

  } 
  
  return (
    <>
      <div className="w-100 flex-center">
        <div className="filter-controlers flex-around">
          <div className={`flex-around filter name pointer-cursor ${orderBy.orderer === 'project_name' && 'active-filter'}`} 
            onClick={() => handleOrder('project_name')}>
              Name {orderBy.orderer === 'project_name' && <i className={`arrow ${orderBy.asc ? 'up' : 'down'}`}></i>}
          </div>
          
          <div className={`flex-around filter status pointer-cursor ${orderBy.orderer === 'status' && 'active-filter'}`} 
            onClick={() => handleOrder('status')}>
              Status{orderBy.orderer === 'status' && <i className={`arrow ${orderBy.asc ? 'up' : 'down'}`}></i>}
          </div>
          
          <div className={`flex-around filter date pointer-cursor ${orderBy.orderer === 'date' && 'active-filter'}`} 
            onClick={() => handleOrder('date')}>
              Date{orderBy.orderer === 'date' && <i className={`arrow ${orderBy.asc ? 'up' : 'down'}`}></i>}
          </div>
          
          <div className={`flex-around filter created_at pointer-cursor ${orderBy.orderer === 'created_at' && 'active-filter'}`} 
            onClick={() => handleOrder('created_at')}>
              Created{orderBy.orderer === 'created_at' && <i className={`arrow ${orderBy.asc ? 'up' : 'down'}`}></i>}
          </div>
        </div>
      </div>
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
          <CustomTooltip
            tooltipContent={
              isErrorResponse(projects) ? unauthorizedErrorCode.message : null
            }>
            <div
              className="card add-card flex-center pointer-cursor"
              onClick={() => onOpenModal(null)}>
              <AddIcon className="add-icon" fontSize="large" />
            </div>
          </CustomTooltip>
        </>

        {Array.isArray(projects)
          ? orderFunc(projects, [orderBy.orderer], [orderBy.asc ? 'asc' : 'desc']).map((project: any, index: number) => {
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
