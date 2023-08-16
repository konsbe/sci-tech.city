import React from "react";
import { TextField } from "@mui/material";


const InputForm = ({ ...otherProps }) => {
  return (
    <div>
      <TextField {...otherProps} />
    </div>
  );
};

export default InputForm;
