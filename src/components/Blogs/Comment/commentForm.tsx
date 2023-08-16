import React, { useState } from "react";
import InputForm from "../../Form/InputForm";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

interface IComment {
  author: string;
  comment: string;
  post: string;
}
const initalState: IComment = {
  author: "asd",
  comment: "",
  post: "",
};

const CommentForm = ({ blogId }: any) => {
  const [formData, setFormData] = useState<IComment>({
    ...initalState,
    post: blogId,
  });

  const resetForm = () => {
    setFormData(initalState);
  };
  const handleSubmit = (e: React.SyntheticEvent | React.FormEvent) => {
    e.preventDefault();
    const myCommentData: IComment = {
      ...formData,
    };
    resetForm();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h6>{/* {currentUser ? <p>{currentUser}</p> : <>p</>} */}</h6>
      <InputForm
        label="Comment"
        color="success"
        variant="standard"
        value={formData.comment}
        sx={{ input: { color: 'white' } }}
        fullWidth
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData({
            ...formData,
            comment: e.target.value,
            author: "userContextData.userName",
          })
        }
      />
      <ButtonGroup fullWidth size="large" sx={{ mt: 1.5 }}>
        <Button type="submit" size="large" color="primary">
          add
        </Button>
        <Button color="secondary" size="large" onClick={resetForm} fullWidth>
          clear
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default CommentForm;
