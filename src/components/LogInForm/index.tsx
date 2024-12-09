"use client";
import React, { useContext, useState } from "react";
import ButtonForm from "../Form/ButtonForm";
import InputForm from "../Form/InputForm";
import { Box } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Icon from "./icon";
import styles from "@/src/styles/Form.module.css";
import { login } from "@/src/app/actions";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/src/providers/AuthProvider";
import { hashFunction } from "@/src/utils/bcrypt";

const initialState = {
  username: "",
  password: "",
};

function LoginForm(): JSX.Element {
  const [formData, setFormData] = useState(initialState);
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent | React.FormEvent) => {
    e.preventDefault();
    const formDataDTO = {
      ...formData,
    };
    
    const loginUser = await login(formDataDTO);
    loginUser[1] && localStorage.setItem("image", JSON.stringify(loginUser[1]?.picture));
    loginUser[1] && localStorage.setItem("image_type", JSON.stringify(loginUser[1]?.image_type));

      
    return loginUser[0]?.access_token ?  router.push("/") : null;
  };

  return (
    <form onSubmit={handleSubmit} className="sign-up-form">
      <InputForm
        label="username"
        type="username"
        name="username"
        placeholder="example@username.com"
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
