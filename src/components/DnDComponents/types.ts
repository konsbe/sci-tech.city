import moment from "moment";

export type ColumnType =
  | "backlog"
  | "todo"
  | "inprogress"
  | "test"
  | "finished";

  export type StatusType =
  | "none"
  | "todo"
  | "in_progress"
  | "finished"
  | "error"
  | "blocked"

export type TaskType = {
  id: string;
  taskName: string;
  starting_date: number;
  ending_date: number;
  status: string;
  description: string;
};

export type ProjectType = {
  id: string;
  projectName: string;
  date: number;
  status: string;
  description: string;
  tasks: TaskType[];
};

export type Task = {
  id: string;
  field: ColumnType;
  taskName: string;
  starting_date: number;
  ending_date: number;
  status: StatusType;
  description: string;
};

export const INIT_TASK_DATA: Task = {
  id: "none",
  field: "backlog", // Use a value from ColumnType
  taskName: "Sample Task",
  starting_date: moment().toDate().valueOf(),
  ending_date: moment().toDate().valueOf(), // +1 day
  status: "todo",
  description: "This is a sample task description.",
};

export const INIT_PROJECT_DATA: ProjectType = {
  id: "",
  projectName: "",
  date: moment().utc().valueOf(),
  status: "none",
  description: "",
  tasks: [], // Empty array, but we'll explicitly type it as TaskType[]
};

export enum ENUMMODALTYPE {
  NEW,
  EDIT,
}

export const mockDataTask: Task[] = [
  {
    id: "1",
    field: "backlog",
    taskName: "Backlog Task 1",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "todo",
    description: "Task description",
  },
  {
    id: "2",
    field: "backlog",
    taskName: "Backlog Task 2",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "todo",
    description: "Task description",
  },
  {
    id: "3",
    field: "todo",
    taskName: "To Do Task 1",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "todo",
    description: "Task description",
  },
  {
    id: "4",
    field: "finished",
    taskName: "To Do Task 1",
    starting_date: 1732143600000,
    ending_date: 1732143600000,
    status: "todo",
    description: "Task description",
  },
];

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

export const mockData: ProjectType[] = [
  {
    id: "asdw123-213",
    projectName: "Lynx",
    date: 1732143600000,
    status: "in_progress",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sagittis viverra turpis, non cursus ex accumsan at.",
    tasks: [
      {
        id: "asdw123-213",
        taskName: "Task name",
        starting_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id: "asdw123-213",
    projectName: "DeepSea",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id: "asdw123-213",
        taskName: "Task name",
        starting_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id: "asdw123-213",
        taskName: "Task name",
        starting_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id: "asdw123-213",
        taskName: "Task name",
        starting_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id: "asdw123-213",
        taskName: "Task name",
        starting_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id: "asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id: "asdw123-213",
        taskName: "Task name",
        starting_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
];
