"use client";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import ButtonForm from "../Form/ButtonForm";
import InputForm from "../Form/InputForm";
import Icon from "./icon";
import { Button, ButtonGroup } from "@mui/material";
import styled from "@emotion/styled";
import FileBase from "react-file-base64";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FormControl from "@mui/material/FormControl";
import styles from "@/src/styles/Form.module.css";
import Profile from "./Profile";
import { hashCompareFunction, hashFunction } from "@/src/utils/bcrypt";

const initialState = {
  userName: "",
  email: "",
  birthDay: "",
  password: "",
  confirmPassword: "",
  profilePicture: "",
};
const fetchCharacters = async (page: number) => {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem fetching data: ", error);
  }
};
function SignUpForm() {
  const [data, setData] = useState<any>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formData, setFormData] = useState(initialState);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e: React.SyntheticEvent | React.FormEvent) => {
    if (!formData.profilePicture) {
      setFormData({ ...formData, profilePicture: data.image });
    }
    e.preventDefault();
    // if (formData.password === formData.confirmPassword) {
    if (await hashCompareFunction(confirmPassword, formData.password)) {
      console.log(formData);
    } else {
      alert("password is not the same");
    }
  };

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === "password") {
        setPassword(e.target.value);
        const hashedPassword = await hashFunction(e.target.value);
        setFormData({
          ...formData,
          password: String(hashedPassword),
        });
      } else if (e.target.name === "confirmPassword") {
        setConfirmPassword(e.target.value);
        const hashedConfirmPassword = await hashFunction(e.target.value);
        setFormData({
          ...formData,
          confirmPassword: String(hashedConfirmPassword),
        });
      } else {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      }
    },
    [formData]
  );

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setFormData(initialState);
    if (!formData.profilePicture) {
      setFormData({ ...formData, profilePicture: data.image });
    }
    console.log("DirectionsCarRounded", formData);
  };

  const changeCharacter = (stm: string) => {
    if (stm === "increment") {
      if (page === 826) {
        setPage(1);
      } else {
        setPage(page + 1);
      }
    } else {
      if (page === 1) {
        setPage(826);
      } else {
        setPage(page - 1);
      }
    }
  };

  useEffect(() => {
    fetchCharacters(page).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        {loading ? <span>Loading...</span> :<Profile
          name={data?.name}
          image={
            formData.profilePicture ? formData.profilePicture : data?.image
          }
        />}
      </div>
      <Container>
        <ButtonGroup>
          <Button
            color="error"
            variant="text"
            onClick={() => changeCharacter("decrement")}>
            Previous Character
          </Button>
          <Button
            color="success"
            variant="text"
            onClick={() => changeCharacter("increment")}>
            Next Character
          </Button>
        </ButtonGroup>
      </Container>
      <form onSubmit={handleSubmit} className={styles.signUpform}>
        <FormControl variant="standard">
          <div className={styles.filebase}>
            <FileBase
              type="file"
              multiple={false}
              name="profilePicture"
              fullWidth
              value={formData.profilePicture}
              onDone={({ base64 }: any) =>
                setFormData({ ...formData, profilePicture: base64 })
              }
            />
            <Button color="error" onClick={resetForm}>
              discard
            </Button>
          </div>
          <InputForm
            label="Username"
            name="userName"
            color="success"
            placeholder="First Name"
            variant="standard"
            value={formData.userName}
            focused
            sx={{ width: 200, input: { color: "white" } }}
            onChange={handleChange}
          />
        </FormControl>
        <InputForm
          label="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          variant="standard"
          value={formData.email}
          sx={{ width: 200, input: { color: "white" } }}
          onChange={handleChange}
        />
        <InputForm
          type="date"
          label="BirthDay"
          variant="standard"
          name="birthDay"
          value={formData.birthDay}
          sx={{ width: 200, input: { color: "white" } }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
        />
        <InputForm
          label="password"
          type="password"
          variant="standard"
          value={password}
          placeholder="password"
          name="password"
          color="secondary"
          sx={{ width: 200, input: { color: "white" } }}
          onChange={handleChange}
        />
        <InputForm
          type="password"
          label="confirm password"
          variant="standard"
          value={confirmPassword}
          sx={{ width: 200, input: { color: "white" } }}
          placeholder="confirm password"
          name="confirmPassword"
          color="secondary"
          onChange={handleChange}
        />
        <ButtonForm
          // className={classes.googleButton}
          color="primary"
          fullWidth
          startIcon={<Icon />}
          vaiant="contained">
          {" "}
          Google Sign in
        </ButtonForm>
        <ButtonForm
          className={styles.buttonBox}
          startIcon={<LockOpenIcon />}
          variant="outlined"
          color="success"
          type="submit"
          sx={{ width: 200, input: { color: "white" } }}>
          Sign Up
        </ButtonForm>
      </form>
    </>
  );
}

export const Container = styled.div<any>((props) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default SignUpForm;
