import React, { ChangeEvent, useContext } from "react";
import { SelectChangeEvent, TextField } from "@mui/material";
import { Task } from "./types";
import moment from "moment";
import { ModalContext } from "@/src/providers/ModalProvider";

export default function TaskForm({
  taskData,
  handleChange,
  onSubmitTaskData,
}: {
  taskData: Task;
  handleChange: (
    e:
      | ChangeEvent<HTMLSelectElement>
      | SelectChangeEvent
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmitTaskData: (dt: Task) => void;
}) {
  const { openModal, closeModal } = useContext(ModalContext);
  
  return (
    <div className="card flex-col-between">
      <div className="form-title-section">
        <TextField
          id="standard-basic"
          label="Project Title"
          variant="standard"
          name="task_name"
          value={taskData.task_name}
          onChange={(e) => handleChange(e)}
          className="blog-title task-form-small-element"
          sx={{ width: 200 }}
        />
        <div className="flex-between">
          <div className="form-status-section">
            <select
              className="task-form-small-element rounded-corners"
              name="status"
              id="lang"
              value={taskData.status}
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
        </div>
        <div className="form-calendar-section flex-between">
          <input
            className="form-datepicker task-form-small-element rounded-corners"
            type="date"
            id="starting_date"
            name="starting_date"
            value={moment(Number(taskData.starting_date)).utc().format("YYYY-MM-DD")}
            onChange={(e) => handleChange(e)}
          />
          <input
            className="form-datepicker task-form-small-element rounded-corners"
            type="date"
            id="ending_date"
            name="ending_date"
            value={moment(Number(taskData.ending_date)).utc().format("YYYY-MM-DD")}
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      <div className="form-description-section">
        <span className="text-area-title">description:</span>
        <textarea
          className="task-form-big-element rounded-corners"
          id="description"
          name="description"
          rows={4}
          cols={40}
          onChange={(e) => handleChange(e)}
          value={taskData.description}></textarea>
      </div>
      <div className="form-description-section">
        <span className="text-area-title">info:</span>
        <textarea
          className="task-form-big-element rounded-corners"
          id="info"
          name="info"
          rows={20}
          cols={40}
          onChange={(e) => handleChange(e)}
          value={taskData.info}></textarea>
      </div>
      <div className="options">
        <button className="btn-cancel" onClick={closeModal}>
          Cancel
        </button>
        <button onClick={() => onSubmitTaskData(taskData)} className="btn-add">
          {taskData.id > 0 ? 'Edit' : 'Add'}
        </button>
      </div>
    </div>
  );
}
