"use client";
import React, { ChangeEvent, useContext, useState } from "react";
import { INIT_PROJECT_DATA, ProjectType } from "./types";
import CircleIcon from "@mui/icons-material/Circle";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ModalContext } from "@/src/providers/ModalProvider";
import Modal from "@/src/components/Modal";
import { SelectChangeEvent, TextField } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { createProject, deleteProject, updateProject } from "@/src/app/actions";

function ProjectManager({ projects }) {
  const [projectData, setProjectData] = useState(INIT_PROJECT_DATA);
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
    const create = await createProject({
      ...projectData,
      id: (projects.length + 1).toString(),
    });
    console.log("create: ", create);
  };
  const onSubmitEditProjectData = async () => {
    const update = await updateProject({ ...projectData });
    console.log("update: ", update);
  };
  const onSubmitDeleteProjectData = async (projectId) => {
    console.log("projectId: ", projectId);
    
    const deletePr = await deleteProject(projectId);
    console.log("delete: ", deletePr);
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
        <div className="card flex-col-between">
          <div className="form-title-section">
            <TextField
              id="standard-basic"
              label="Project Title"
              variant="standard"
              name="projectName"
              value={projectData.projectName}
              onChange={(e) => handleChange(e)}
              className="blog-title"
              sx={{ width: 200 }}
            />

            <div className="form-status-section">
              <select
                className="rounded-corners"
                name="status"
                id="lang"
                value={projectData.status}
                onChange={(e) => handleChange(e)}>
                <option value="none">⚪ None</option>
                <option value="to_do">🔵 To do</option>
                <option value="yellow"> Yellow</option>
                <option value="in_progress">🟣 In progress</option>
                <option value="finished">🟢 Finished</option>
                <option value="blocked"> 🔴 Error</option>
                <option value="blocked"> 🟡 Test</option>
                <option value="blocked"> 🟠 Blocked</option>
              </select>
            </div>
            <div className="form-calendar-section">
              <input
                className="form-datepicker rounded-corners"
                type="date"
                id="date"
                name="date"
                value={moment(projectData.date).utc().format("YYYY-MM-DD")}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="form-description-section">
            <textarea
              className="rounded-corners"
              id="description"
              name="description"
              rows={4}
              cols={40}
              onChange={(e) => handleChange(e)}
              value={projectData.description}></textarea>
          </div>
          <div className="options">
            <button className="btn-cancel" onClick={closeModal}>
              Cancel
            </button>
            <button onClick={projectData.id ? onSubmitEditProjectData : onSubmitProjectData} className="btn-add">
              Add
            </button>
          </div>
        </div>
      </Modal>

      <div className="tasks-container">
        <div
          className="card add-card flex-center pointer-cursor"
          onClick={() => onOpenModal(null)}>
          <AddIcon className="add-icon" fontSize="large" />
        </div>
        {projects.map((project: any, index: number) => {
          return (
            <div key={index} className="card flex-col-between">
              <div className="title-section">
                <div className="blog-title flex-between">
                  {project.projectName}
                  <EditNoteIcon
                    className="pointer-cursor"
                    onClick={() => onOpenModal(project)}
                  />
                </div>
                <div className="status-section flex-center-start">
                  <CircleIcon color="primary" fontSize="small" />
                  <span className="blog-status">{project.status}</span>
                </div>
                <span className="blog-time">
                  {moment(project.date).utc().format("dddd MMM D, YYYY")}
                </span>
                <span className="blog-status">
                  {project.tasks.length} tasks
                </span>
              </div>
              <div className="description-section">
                <p className="description">{project.description}</p>
              </div>
              <div className="options">
                <DeleteForeverIcon onClick={() => onSubmitDeleteProjectData(project.id)} className="trash-icon pointer-cursor" />
                <Link href={`/task-manager/${project.id}`} className="linkText">
                  <button className="btn">Checkout Project</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProjectManager;
