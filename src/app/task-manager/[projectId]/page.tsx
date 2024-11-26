import TaskManager from "@/src/components/DnDComponents/TaskManager";
import "../projectManager.css";
import "./taskManager.css";
import { getProjectTasks } from "../../actions";


interface TaskManagerRouterProps {
  params: { projectId: string };
}

async function TaskManagerRouter({ params }: TaskManagerRouterProps) {
  const { projectId } = params; // Get the 'id' from the URL
  const tasks = await getProjectTasks(Number(projectId));
  
  return <TaskManager tasksData={tasks}/>;
}
export async function generateMetadata({ params }: TaskManagerRouterProps) {
  return {
    title: `Sci.Task Manager - ${params.projectId}`,
  };
}
export default TaskManagerRouter;
