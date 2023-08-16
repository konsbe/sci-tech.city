'use client'
import React, { useReducer, useState, useContext } from "react";
import { LoginContext } from "../Contexts";
import ButtonForm from "../Form/ButtonForm";
import InputForm from "../Form/InputForm";
import { Box } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Icon from "./icon";
import styles from "@/src/styles/Form.module.css";

const initialState = {
  email: "",
  password: "",
};

function LoginForm(): JSX.Element {

  const [data, setData] = useState<any>();
  const [formData, setFormData] = useState(initialState);

  const context: any = useContext(LoginContext);
  const { userContextData, setUserContextData } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent | React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.signUpform}>
      <InputForm
        label="email"
        type="email"
        name="email"
        placeholder="example@email.com"
        variant="standard"
        autoFocus
        sx={{ width: 200, input: { color: "white" } }}
        onChange={handleChange}
      />
      <InputForm
        label="password"
        type="password"
        name="password"
        variant="standard"
        color="secondary"
        sx={{ width: 200, input: { color: "white" } }}
        onChange={handleChange}
      />
      <Box component="div">
        <ButtonForm
          className={styles.buttonBox}
          startIcon={<LockOpenIcon />}
          variant="outlined"
          color="success"
          type="submit"
          sx={{ width: 200 }}>
          Log in
        </ButtonForm>
      </Box>

      <ButtonForm
        // className={classes.googleButton}
        color="primary"
        fullWidth
        startIcon={<Icon />}
        vaiant="contained">
        {" "}
        Google Log in
      </ButtonForm>
    </form>
  );
}

export default LoginForm;
