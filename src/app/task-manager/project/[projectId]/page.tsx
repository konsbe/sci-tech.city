import "../../projectManager.css";
import "../../[projectId]/taskManager.css";
import "../../[projectId]/[taskId]/taskCard.css";
import { getProject } from "../../../actions";
import ProjectInfo from "@/src/components/DnDComponents/ProjectInfo";


interface TaskManagerRouterProps {
  params: { projectId: string, taskId: string };
}

async function ProjectRouter({ params }: TaskManagerRouterProps) {
  const { projectId } = params; // Get the 'id' from the URL
  const project = await getProject(Number(projectId));
    
  return <ProjectInfo projectData={project}/>;
}
export async function generateMetadata({ params }: TaskManagerRouterProps) {
  return {
    title: `Sci.Task Manager - ${params.projectId}`,
  };
}
export default ProjectRouter;
