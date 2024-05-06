import React, { FC, useState, useEffect } from "react";
import InputForm from "../Form/InputForm";

import BackspaceIcon from "@mui/icons-material/Backspace";
import { Button, ButtonGroup, Input } from "@mui/material";

import styles from "./Project.module.css";
import { IProject, IProps } from "./interface";
import useUpdateFields from "@/src/utils/hooks";
import { Base64 } from "@/src/interfaces/user";
import { convertBase64 } from "@/src/utils/image";

const ProjectsForm: FC<IProps> = ({ currentId, setCurrentId }): JSX.Element => {
  const createProject = ((myProjectData: IProject) => {
    return ;
  });

  const updateProject = ((myProjectData: IProject) => {
    return;
  });

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    tags: "",
    selectedFile: "",
  });

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = e.target.files[0];
    const base64: Base64<"png" | "jpg" | "jpeg"> | any = await convertBase64(
      file
    );
    setPostData({ ...postData, selectedFile: base64 })
  };
  
  const resetForm = () => {
    setPostData({
      title: "",
      description: "",
      tags: "",
      selectedFile: "",
    });
    setCurrentId(0);
  };
  const { data } = useUpdateFields(currentId);
  useEffect(() => {
    if (currentId) {
      setPostData({
        title: data.title,
        description: data.description,
        tags: data.tags,
        selectedFile: data.selectedFile,
      });
    }
  }, [currentId, data.description, data.selectedFile, data.tags, data.title]);
  const handleSubmit = (e: React.SyntheticEvent | React.FormEvent) => {
    e.preventDefault();

    if (currentId) {

      const myProjectData: IProject = {
        ...postData,
        name: "user?.result?.name ",
      };
      // useDipsatchUpdateProject(myProjectData);

      resetForm();
    } else {
      const myProjectData: IProject = {
        ...postData,
        name: "user?.result?.name ",
      };
      // useDipsatchCreateProject(myProjectData);
      resetForm();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.projectForm}>
        <InputForm
          label="Title"
          color="success"
          variant="standard"
          fullWidth
          value={postData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPostData({ ...postData, title: e.target.value })
          }
        />
        <InputForm
          id="outlined-multiline-static"
          label="Description"
          multiline
          value={postData.description}
          rows={4}
          fullWidth
          sx={{ mt: 1.5 }}
          placeholder="write your description here.."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPostData({ ...postData, description: e.target.value })
          }
        />
        <InputForm
          id="outlined-multiline-static"
          label="#tags"
          multiline
          value={postData.tags}
          rows={2}
          fullWidth
          sx={{ mt: 1.5 }}
          placeholder="#tags"
          onChange={(e: any) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />
        <div className={styles.filebase}>
          {/* <FileBase
            type="file"
            multiple={false}
            fullWidth
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          /> */}
                  <div className="filebase flex-center">
          <Input
            id="standard-basic"
            type="file"
            onChange={(e: any) => {
              uploadImage(e);
              // setUserData({ ...userData, image: e.target.value });
            }}
            style={{ marginBottom: "1rem" }}
            fullWidth
            // sx={placeholder_styles}
          />
          <Button color="error" onClick={resetForm}>
            discard
          </Button>
        </div>

        </div>
        <ButtonGroup
          className={styles.btnProjectFormGroup}
          fullWidth
          size="large"
          sx={{ mt: 1.5 }}
        >
          <Button
            // startIcon={<SaveIcon />}
            type="submit"
            size="large"
            color="primary"
          >
            add
          </Button>
          <Button
            startIcon={<BackspaceIcon />}
            color="secondary"
            size="large"
            onClick={resetForm}
            fullWidth
          >
            clear
          </Button>
        </ButtonGroup>
      </form>
    </>
  );
};

export default ProjectsForm;


