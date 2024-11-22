"use client";
import React, { useState } from "react";
import "./taskManager.css";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import moment from "moment";

function Task() {
  const STATUS_TYPES = {
    none: { circle: "⚪", type: "None" },
    todo: { circle: "🔵", type: "To do" },
    inprogress: { circle: "🟣", type: "In progress" },
    finished: { circle: "🟢", type: "Finished" },
    error: { circle: "🔴", type: "Error" },
    blocked: { circle: "🟠", type: "Blocked" },
  };
  const data = {
    id: "asdw123-213",
    taskName: "Task name",
    startind_date: 1732143600000,
    ending_date: 1732143600000,
    status: "todo",
    description:
      "this is a task description this is a task description this is a task description this is a task description this is a task description this is a task description this is a task description",
  };
  return (
    <div className="task-dnd-space-container">
      <div className="outer-task-container section-backlog">
        <div className="task-devision-section">
          <span className="task-devision-title">Backlog</span>
          <AddIcon className="add-icon pointer-cursor" />
        </div>
        <div className="task-section ">
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div className="title-section">{data.taskName}</div>
                <div className="status-section">{data.status}</div>
              </div>
              <div className="flex-between">
                <span className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </span>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <div className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="blog-time flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
        </div>
      </div>
      <div className="outer-task-container section-todo">
        <div className="task-devision-section">
          <span className="task-devision-title">To do</span>
          <AddIcon className="add-icon pointer-cursor" />
        </div>
        <div className="task-section ">
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div className="title-section">{data.taskName}</div>
                <div className="status-section">{data.status}</div>
              </div>
              <div className="flex-between">
                <span className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </span>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <div className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="blog-time flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
        </div>
      </div>
      <div className="outer-task-container section-inprogress">
        <div className="task-devision-section">
          <span className="task-devision-title">In Progress</span>
          <AddIcon className="add-icon pointer-cursor" />
        </div>
        <div className="task-section ">
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div className="title-section">{data.taskName}</div>
                <div className="status-section">{data.status}</div>
              </div>
              <div className="flex-between">
                <span className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </span>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <div className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="blog-time flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
        </div>
      </div>
      <div className="outer-task-container section-test">
        <div className="task-devision-section">
          <span className="task-devision-title">Test</span>
          <AddIcon className="add-icon pointer-cursor" />
        </div>
        <div className="task-section ">
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div className="title-section">{data.taskName}</div>
                <div className="status-section">{data.status}</div>
              </div>
              <div className="flex-between">
                <span className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </span>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <div className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="blog-time flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon className="pointer-cursor" />
              <EditNoteIcon className="pointer-cursor" />
            </div>
          </div>
        </div>
      </div>
      <div className="outer-task-container section-finished">
        <div className="task-devision-section">
          <span className="task-devision-title">Finished</span>
          <AddIcon className="add-icon pointer-cursor" />
        </div>
        <div className="task-section ">
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div className="title-section">{data.taskName}</div>
                <div className="status-section">{data.status}</div>
              </div>
              <div className="flex-between">
                <span className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </span>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon />
              <EditNoteIcon />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <div className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon />
              <EditNoteIcon />
            </div>
          </div>
          <div className="task-list-section flex-col-between" key={data.id}>
            <div className="header-task-section">
              <div className="flex-between">
                <div>{data.taskName}</div>
                <div>{data.status}</div>
              </div>
              <div className="blog-time flex-between">
                <div className="blog-time">
                  start: {moment(data.startind_date).utc().format("DD/MM/YYYY")}
                </div>
                <span className="blog-time">
                  ends: {moment(data.ending_date).utc().format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            <div className="description-task-section flex-center-start">
              {data.description}
            </div>
            <div className="flex-between">
              <DeleteForeverIcon />
              <EditNoteIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
