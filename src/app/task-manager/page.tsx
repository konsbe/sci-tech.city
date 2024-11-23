import ProjectManager from "@/src/components/DnDComponents/ProjectManager";
import "./projectManager.css";
import { getProjects } from "../actions";


async function TaskManagerRouter() {
  
  const projects = await getProjects();

  return <ProjectManager projects={projects} />;
}

export default TaskManagerRouter;
