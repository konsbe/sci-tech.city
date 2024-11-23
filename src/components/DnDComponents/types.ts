import moment from "moment";

export type ColumnType = "backlog" | "todo" | "inprogress" | "finished";

export type StatusType =
  | "none"
  | "todo"
  | "in_progress"
  | "finished"
  | "error"
  | "blocked";

// Type for Project
export type ProjectType = {
  id: string;
  projectName: string;
  date: number; // Use number for large numbers like timestamps
  status: string; // Could be a string enum type if status values are predefined
  description: string;
  userEmail: string;
  tasks: Task[] | [] | null; // Relationship with tasks
  createdAt?: Date | number;
  updatedAt?: Date | number;
};

// Type for Task
export type Task = {
  id: string;
  field: ColumnType; // Enum reference
  taskName: string;
  starting_date: number; // Use number for large numbers like timestamps
  ending_date: number; // Same as above
  status: StatusType; // Enum reference
  description: string;
  projectId: string;
  userEmail: string;
  createdAt?: Date | number;
  updatedAt?: Date | number;
};

export const INIT_TASK_DATA: Task = {
  id: "none",
  field: "backlog", // Use a value from ColumnType
  taskName: "Sample Task",
  starting_date: moment().toDate().valueOf(),
  ending_date: moment().toDate().valueOf(), // +1 day
  status: "todo",
  description: "This is a sample task description.",
  projectId: "",
  userEmail: "",
};

export const INIT_PROJECT_DATA: ProjectType = {
  id: "",
  projectName: "",
  date: moment().utc().valueOf(),
  status: "none",
  description: "",
  tasks: [],
  userEmail: "",
};

export enum ENUMMODALTYPE {
  NEW,
  EDIT,
}

export const headerTitleMapper = (header: string) => {
  return header === "backlog"
    ? "Backlog"
    : header === "todo"
    ? "To do"
    : header === "inprogress"
    ? "In Progress"
    : header === "test"
    ? "Test"
    : "Finished";
};

export const mockDataTask: Task[] = [
  {
    id: "1",
    field: "backlog",
    taskName: "Backlog Task 1",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "todo",
    description: "Task description",
    projectId: "",
    userEmail: "",
  },
  {
    id: "2",
    field: "backlog",
    taskName: "Backlog Task 2",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "in_progress",
    description: "Task description",
    projectId: "",
    userEmail: "",
  },
  {
    id: "3",
    field: "todo",
    taskName: "To Do Task 1",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "blocked",
    description: "Task description",
    projectId: "",
    userEmail: "",
  },
  {
    id: "4",
    field: "finished",
    taskName: "To Do Task 1",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "error",
    description: "Task description",
    projectId: "",
    userEmail: "",
  },
];

export const mockData: ProjectType[] = [
  {
    id: "asdw123-213",
    projectName: "Lynx",
    date: 1732143600000,
    status: "in_progress",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sagittis viverra turpis, non cursus ex accumsan at.",
    tasks: mockDataTask,
    userEmail: "",
  },
  {
    id: "asdw123-213",
    projectName: "DeepSea",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: mockDataTask,
    userEmail: "",
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: mockDataTask,
    userEmail: "",
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: mockDataTask,
    userEmail: "",
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: mockDataTask,
    userEmail: "",
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: mockDataTask,
    userEmail: "",
  },
];
