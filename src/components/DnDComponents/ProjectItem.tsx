import React from "react";
import { ProjectType, statusTitleMapper } from "./types";
import CircleIcon from "@mui/icons-material/Circle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import moment from "moment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";
import KitesurfingIcon from "@mui/icons-material/Kitesurfing";

const ProjectItem = ({
  project,
  onOpenModal,
  onDeleteProjectData,
}: {
  project: ProjectType;
  onDeleteProjectData: (projectId: number) => void;
  onOpenModal: (projectDto: ProjectType) => void;
}) => {
  return (
    <>
      <div className="title-section">
        <div className="blog-title flex-between">
          {project.project_name}
          <div>
            <EditNoteIcon
              className="pointer-cursor"
              onClick={() => onOpenModal(project)}
            />
            <Link href={`/task-manager/project/${project.id}`}>
              <KitesurfingIcon className="pointer-cursor" />
            </Link>
          </div>
        </div>
        <div className="status-section flex-center-start">
          <span className="blog-status">{statusTitleMapper(project.status)}</span>
        </div>
        <span className="blog-time">
          {moment(Number(project.date)).utc().format("dddd MMM D, YYYY")}
        </span>
        <span className="blog-status">{project?.tasks?.length} tasks</span>
      </div>
      <div className="description-section">
        <p className="description">{project.description}</p>
      </div>
      <div className="options">
        <DeleteForeverIcon
          onClick={() => onDeleteProjectData(project.id)}
          className="trash-icon pointer-cursor"
        />
        <Link href={`/task-manager/${project.id}`} className="linkText">
          <button className="btn">Checkout Project</button>
        </Link>
      </div>
    </>
  );
};

export default ProjectItem;
