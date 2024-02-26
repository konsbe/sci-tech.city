"use client";
import React, { useCallback, useEffect, useState } from "react";
import ButtonForm from "../Form/ButtonForm";
import InputForm from "../Form/InputForm";
import Icon from "./icon";
import { Button, ButtonGroup, Input, colors } from "@mui/material";
import styled from "@emotion/styled";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import styles from "@/src/styles/Form.module.css";
import Profile from "./Profile";
import { hashCompareFunction, hashFunction } from "@/src/utils/bcrypt";
import { createUser } from "@/src/app/actions";
import { Base64, UserInfo } from "@/src/interfaces/user";
import { convertBase64 } from "@/src/utils/image";

const initialState = {
  userName: "",
  email: "",
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
  const [formData, setFormData] = useState<UserInfo>(initialState);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [confirmPassBool, setConfirmPassBool] = useState(true);
  const placeholder_styles = {
    width: "100%",
    marginBottom: 1,
    input: {
      "&::placeholder": {
        // <----- Add this.
        opacity: 1,
      },
      //input font-color
      color: "white",
    },
    //label placeholder font-color
    label: { color: "white" },
  }
  const handleSubmit = async (e: React.SyntheticEvent | React.FormEvent) => {
    e.preventDefault();

    if (await hashCompareFunction(formData.confirmPassword, formData.password)) {
      const sub = await createUser(formData);
      return sub;
    } else {
      alert("password is not the same");
    }
  };
  
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = e.target.files[0];
    const base64: Base64<"png" | "jpg" | "jpeg"> | any = await convertBase64(
      file
    );
    setFormData({ ...formData, profilePicture: base64 })
  };
  
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      let hashedPassword: string;
      let hashedConfirmPassword: string;
      if (e.target.name === "password") {
        setPassword(e.target.value);
        hashedPassword = await hashFunction(e.target.value);
        setFormData(() => {
          return {
            ...formData,
            password: String(hashedPassword),
          }
        });
      } else if (e.target.name === "confirmPassword") {
        setConfirmPassword(e.target.value);
        hashedConfirmPassword = await hashFunction(e.target.value);
        setFormData(() => {
          return {
            ...formData,
            confirmPassword: String(hashedConfirmPassword),
          }
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
    
    const imageToBase64 = async (data: any) => {
      const imageResponse = await fetch(data.image);
      const imageBlob = await imageResponse.blob();
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = () => {
        const base64Image = reader.result;
        setFormData({ ...formData, profilePicture: base64Image });
      };
    };

    useEffect(() => {
      hashCompareFunction(formData.confirmPassword, formData.password).then((res) => {
        if (typeof res === 'boolean') setConfirmPassBool(res)
      });
    },[formData.confirmPassword, formData.password])
    
    useEffect(() => {
      fetchCharacters(page).then((result) => {
        setData(result);
      imageToBase64(result);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <Profile
            name={data?.name}
            image={
              formData.profilePicture ? formData.profilePicture : data?.image
            }
          />
        )}
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
            sx={placeholder_styles}
          />
          <Button color="error" onClick={resetForm}>
            discard
          </Button>
        </div>
        <div className="">
          <InputForm
            label="Username"
            name="userName"
            color="success"
            placeholder="First Name"
            variant="standard"
            value={formData.userName}
            sx={placeholder_styles}
            onChange={handleChange}
          />
          <InputForm
            label="email"
            type="email"
            name="email"
            placeholder="example@email.com"
            variant="standard"
            value={formData.email}
            sx={placeholder_styles}
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
            sx={placeholder_styles}
            onChange={handleChange}
          />
          <InputForm
            type="password"
            label="confirm password"
            variant="standard"
            value={confirmPassword}
            sx={placeholder_styles}
            placeholder="confirm password"
            name="confirmPassword"
            color={confirmPassBool ? "secondary" : "error"}
            error={!confirmPassBool}
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
            sx={placeholder_styles}>
            Sign Up
          </ButtonForm>
        </div>
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