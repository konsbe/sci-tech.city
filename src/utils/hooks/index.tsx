import { useState, useEffect } from "react";
import { IProjectInfo, IResponseData } from "./interface/IProject";
interface IPropCrypt {
  name: string;
  price: string;
  symbol: string;
}
export default function useUpdateFields(currentId: string) {
  const [projects, setProjects] = useState<IProjectInfo[]>([]);
  const [data, setData] = useState({
    title: "",
    description: "",
    tags: "",
    selectedFile: "",
  });
  const onSuccess = (data: IResponseData) => {
    setProjects(data.data);
  };
  const onError = (error: Error) => {};

  useEffect(() => {
    const project:any = currentId
      ? projects.find((p) => p._id === currentId)
      : null;

    if (currentId) {
      setData({
        title: project.title,
        description: project.description,
        tags: project.tags.join(),
        selectedFile: project.selectedFile,
      });
    }
  }, [currentId, projects]);
  return { data };
}
