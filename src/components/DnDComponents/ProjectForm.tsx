import React, { ChangeEvent } from "react";
import { ProjectType } from "./types";
import { SelectChangeEvent, TextField } from "@mui/material";
import moment from "moment";

const ProjectForm = ({
  projectData,
  handleChange,
  onSubmitTaskData,
  closeModal,
  projectDataRouter,
}: {
  projectData: ProjectType;
  handleChange: (
    e:
      | ChangeEvent<HTMLSelectElement>
      | SelectChangeEvent
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmitTaskData: (dt: ProjectType) => void;
  closeModal: () => void;
  projectDataRouter?: boolean;
}) => {
  
  return (
    <div className="card flex-col-between">
      <div className="form-title-section">
        <TextField
          id="standard-basic"
          label="Project Title"
          variant="standard"
          name="project_name"
          value={projectData.project_name}
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
            <option value="in_progress">🟣 In progress</option>
            <option value="finished">🟢 Finished</option>
            <option value="error"> 🔴 Error</option>
            <option value="test"> 🟡 Test</option>
            <option value="blocked"> 🟠 Blocked</option>
          </select>
        </div>
        <div className="form-calendar-section">
          <input
            className="form-datepicker rounded-corners"
            type="date"
            id="date"
            name="date"
            value={moment(Number(projectData.date)).utc().format("YYYY-MM-DD")}
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
      {projectDataRouter && (
        <div className="form-description-section">
          <span className="text-area-title">info:</span>
          <textarea
            className="task-form-big-element rounded-corners"
            id="info"
            name="info"
            rows={20}
            cols={40}
            onChange={(e) => handleChange(e)}
            value={projectData.info}></textarea>
        </div>
      )}

      <div className="options">
        <button className="btn-cancel" onClick={closeModal}>
          Cancel
        </button>
        <button
          onClick={() => onSubmitTaskData(projectData)}
          className="btn-add">
          {projectData.id > 0 ? "Edit" : "add"}
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
