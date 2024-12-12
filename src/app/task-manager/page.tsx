import ProjectManager from "@/src/components/DnDComponents/ProjectManager";
import "./projectManager.css";
import { getProjects, GetProjectsResponse } from "../actions";

async function TaskManagerRouter() {
  const projects: GetProjectsResponse = await getProjects();
  return <ProjectManager projects={projects} />;
}

export default TaskManagerRouter;
