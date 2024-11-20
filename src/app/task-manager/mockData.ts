export type TaskType = {
  id: string;
  taskName: string;
  startind_date: number;
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

export const mockData: ProjectType[] = [
  {
    id:"asdw123-213",
    projectName: "Lynx",
    date: 1732143600000,
    status: "in_progress",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sagittis viverra turpis, non cursus ex accumsan at.",
    tasks: [
      {
        id:"asdw123-213",
        taskName: "Task name",
        startind_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id:"asdw123-213",
    projectName: "DeepSea",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id:"asdw123-213",
        taskName: "Task name",
        startind_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id:"asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id:"asdw123-213",
        taskName: "Task name",
        startind_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id:"asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id:"asdw123-213",
        taskName: "Task name",
        startind_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id:"asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id:"asdw123-213",
        taskName: "Task name",
        startind_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
  {
    id:"asdw123-213",
    projectName: "Blue Coast Water",
    date: 1732143600000,
    status: "in_progress",
    description: "this is a project description",
    tasks: [
      {
        id:"asdw123-213",
        taskName: "Task name",
        startind_date: 1732143600000,
        ending_date: 1732143600000,
        status: "todo",
        description: "this is a task description",
      },
    ],
  },
];
