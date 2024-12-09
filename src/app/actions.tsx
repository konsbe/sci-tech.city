"use server";

import { cookies } from "next/headers";
import { UserInfo } from "../interfaces/user";
import { Task, ProjectType } from "../components/DnDComponents/types";

import { PrismaClient } from '@prisma/client';
import moment from "moment";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const prisma = new PrismaClient();





// Type for the return value of `getProjects` and `getProjectTasks`
type GetProjectsSuccess = ProjectType[];

type GetTaskSuccess = Task;
type GetProjectTasksSuccess = Task[];

// Type for the error response
export type ErrorResponse = {
  message: string;
  code: number;  // You can customize this to fit your error model (e.g., Prisma error codes)
};




// Type for the response of the `getProjects` function
export type GetProjectsResponse = GetProjectsSuccess | ErrorResponse;
// Type for the response of the `getProjectsTasks` function
export type GetProjectsTasksResponse = GetProjectTasksSuccess | ErrorResponse;
// Type for the response of the `getTasks` function
export type GetTaskResponse = GetTaskSuccess | ErrorResponse;

// Type for the response of the `getProjectTasks` function
// Custom function to handle BigInt serialization
function bigIntReplacer(key: string, value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}

const unauthorizedErrorCode = {message: 'Unauthorized', code: 401}

export async function createCookie(data: any) {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get("user");
  if (hasCookie) return;
  cookies().set({
    name: data.name,
    value: data.value,
    httpOnly: true,
    path: data.path ? data.path : "/",
  });
}
 function getCookie(name: string): RequestCookie | undefined {
  const cookiesList = cookies();

  const hasCookie = cookiesList.get(name);

  return hasCookie;
}

export async function createUser(data: UserInfo) {
  const clearCookies = cleanCookies(cookies().getAll())
  
  const reqBody = {
    user_id: Date.now(),
    username: data.userName,
    email: data.email,
    picture: data.profilePicture,
    created_at: Date.now(),
    password: data.password,
  };

  const response = await fetch(
    `http://localhost:8082/api/keycloak-service/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    }
  );

  const res: any = await response.json();
  
  return res;
}
async function cleanCookies(ckieLiest: RequestCookie[]) {
  
  if (ckieLiest.length > 0 ) {
    ckieLiest.forEach((ckie) => {cookies().delete(ckie.name)})
  }
  return
}
export async function decodeToken(accessToken: string) {
  
  if (!accessToken || accessToken === undefined) return;

  const parts = accessToken?.split(".");
  if (!parts) return;
  const payload = await JSON.parse(atob(parts[1]));

  return payload;
}

export const login = async (data: { username: string; password: string }) => {
  const clearCookies = cleanCookies(cookies().getAll())

  const response = await fetch("http://localhost:8082/api/keycloak-service/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res: any = await response.json();

  if (res.status) return unauthorizedErrorCode
  const resToken = res[0] ? res[0] : res;
  
  const parts = resToken?.access_token?.split(".");

  if (!res || res.status > 400) return res;
  // const header = JSON.parse(atob(parts[0]));
  
  const payload = JSON.parse(atob(parts[1]));

  await createCookie({
    name: "access_token",
    value: res[0]?.access_token,
  });
  await createCookie({
    name: "profile_data",
    value: res[1] ? res[1] : res,
  });
  const cookie = await createCookie({
    name: "user",
    value: payload?.email,
  });

  return res;
};

export const logout = async () => {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get("access_token");
  const clearCookies = cleanCookies(cookies().getAll())

  
  if (!hasCookie) return;

  const response = await fetch(
    "http://localhost:8082/api/auth/logout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: hasCookie.value }),
    }
  );

  return response;
};


// Fetch all projects
export const getProjects = async (): Promise<GetProjectsResponse> => {
  
  // const hasUserCookie = cookiesList.get("user");
  const hasUserCookie = getCookie("user");
  // cookies().set('name', 'value', { expires: Date.now() - oneDay })
  
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true, // Include associated tasks for each project
      },
      where: {
        user_email: hasUserCookie?.value, // Match the correct database column
      },
    });

    // Serialize with BigInt handling
    const serializedProjects = hasUserCookie ? JSON.parse(JSON.stringify(projects, bigIntReplacer)) : JSON.parse(JSON.stringify(unauthorizedErrorCode));
    return serializedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { message: "Error fetching projects", code: 500 }; // Return an error response
  }
};

// Fetch all tasks for a specific project and user email
export const getProjectTasks = async (project_id: number): Promise<GetProjectsResponse> => {
  const hasUserCookie = getCookie("user");

  try {
    const tasks = await prisma.task.findMany({
      where: {
        project_id: project_id,
        user_email: hasUserCookie?.value, // Filter by userEmail
      },
    });

    // Serialize with BigInt handling
    const serializedProjects = JSON.parse(JSON.stringify(tasks, bigIntReplacer));
    return serializedProjects;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return { message: "Error fetching project tasks", code: 500 }; // Return an error response
  }
};

// Fetch specific tasks for a specific project and user email
export const getProject = async (project_id: number): Promise<GetTaskResponse> => {
  const hasUserCookie = getCookie("user");

  try {
    const task = await prisma.project.findUnique({
      where: {
        id: project_id,
        user_email: hasUserCookie?.value, // Filter by userEmail
      },
    });
    
    // Serialize with BigInt handling
    const serializedProjects = JSON.parse(JSON.stringify(task, bigIntReplacer));
    return serializedProjects;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return { message: "Error fetching project tasks", code: 500 }; // Return an error response
  }
}
export const getTask = async (task_id: number, project_id: number): Promise<GetTaskResponse> => {
  const hasUserCookie = getCookie("user");

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: task_id,
        project_id: project_id,
        user_email: hasUserCookie?.value, // Filter by userEmail
      },
    });
    
    // Serialize with BigInt handling
    const serializedProjects = JSON.parse(JSON.stringify(task, bigIntReplacer));
    return serializedProjects;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return { message: "Error fetching project tasks", code: 500 }; // Return an error response
  }
};

"npx prisma migrate dev --name fix-task-relation"
"npx prisma generate"

// Create a new project with user email
export const createProject = async (body: ProjectType) => {
  const hasUserCookie = getCookie("user");


  try {
    const newProject = await prisma.project.create({
      data: {
        id: body.id,
        project_name: body.project_name,
        date: body.date ,
        status: body.status,
        description: body.description,
        info: body.info,
        user_email: hasUserCookie?.value || '',
        tasks: {},
      },
    });
    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const createTask = async (body: Task) => {
  const cookiesList = cookies();
  
  const hasUserCookie = cookiesList.get("user");

  try {
    const newTask = await prisma.task.create({
      data: {
        id: body.id,
        task_name: body.task_name,
        starting_date: body.starting_date,
        ending_date: body.ending_date,
        status: body.status,
        info: body.info,
        description: body.description,
        field: body.field,
        project_id: body.project_id, // You should use `project_id` instead of `body.id`
        user_email: hasUserCookie?.value || '', // Include userEmail in the task
      },
    });

    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update an existing project with user email
export const updateProject = async (body: ProjectType) => {
  const hasUserCookie = getCookie("user");

  try {
    const updatedProject = await prisma.project.update({
      where: { id: body.id },
      data: {
        project_name: body.project_name,
        date: body.date,
        status: body.status,
        description: body.description,
        info: body.info,
        user_email: hasUserCookie?.value || '', // Update user email if necessary
      },
    });
    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Update an existing task with user email
export const updateTask = async (body: Task) => {
  const hasUserCookie = getCookie("user");

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: body.id,
        project_id: body.project_id, // Ensure project_id is used here, not id
        user_email: hasUserCookie?.value,  // Use user_email for the correct task update
      },
      data: {
        task_name: body.task_name,
        starting_date: body.starting_date,
        ending_date: body.ending_date,
        status: body.status,
        description: body.description,
        info: body.info,
        field: body.field,
        updated_at: new Date(), // Update timestamp manually
        user_email: hasUserCookie?.value
      },
    });
    
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a project with project_id and userEmail
export const deleteProject = async (project_id: number) => {
  const hasUserCookie = getCookie("user");

  try {
    const deletedProject = await prisma.project.deleteMany({
      where: {
        id: project_id,
        user_email: hasUserCookie?.value, // Ensure the user owns the project
      },
    });
    
    return deletedProject;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Delete a task with taskId and userEmail
export const deleteTask = async (taskId: number, projectId: number) => {
  const hasUserCookie = getCookie("user");

  try {
    const deletedTask = await prisma.task.deleteMany({
      where: {
        id: taskId,
        project_id: projectId,
        user_email: hasUserCookie?.value, // Ensure the user owns the task
      },
    });
    return deletedTask;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
