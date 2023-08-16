import React from "react";
import Button from "@mui/material/Button";

function ButtonForm({ children, ...otherProps }:any) {
  return (
    <div>
      <Button {...otherProps}>{children}</Button>
    </div>
  );
}

export default ButtonForm;
