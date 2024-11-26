import TaskManager from "@/src/components/DnDComponents/TaskManager";
import "./taskManager.css";
import { getProjectTasks } from "../../actions";


interface TaskManagerRouterProps {
  params: { taskId: string };
}

async function TaskManagerRouter({ params }: TaskManagerRouterProps) {
  const { taskId } = params; // Get the 'id' from the URL
  const tasks = await getProjectTasks(taskId);
  
  return <TaskManager tasksData={tasks}/>;
}
export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Task Manager - ${params.id}`,
  };
}
export default TaskManagerRouter;
