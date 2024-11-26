import TaskInfo from "@/src/components/DnDComponents/TaskInfo";
import "../../projectManager.css";
import "../taskManager.css";
import "./taskCard.css";
import { getTask } from "../../../actions";


interface TaskManagerRouterProps {
  params: { projectId: string, taskId: string };
}

async function TaskRouter({ params }: TaskManagerRouterProps) {
  const { projectId, taskId } = params; // Get the 'id' from the URL
  const task = await getTask(Number(taskId), Number(projectId));
    
  return <TaskInfo tasksData={task}/>;
}
export async function generateMetadata({ params }: TaskManagerRouterProps) {
  return {
    title: `Sci.Task Manager - ${params.projectId}`,
  };
}
export default TaskRouter;
