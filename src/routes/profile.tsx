"use client";
import { Avatar, Button, Input, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCookie } from "../app/actions";

export interface IProps {
  baseImage: any;
  errorField: string[];
  userData: any;
  setUserData: (e: any) => any;
  uploadImage: (e: any) => void;
  header: string;
  className?: string;
}
export type TypeErrorItem = {
  loc: [];
  msg: string;
  type: string;
};

type Base64<imageType extends string> =
  `data:image/${imageType};base64${string}`;

const SettingsFormComponent = ({ header = "Profile" }) => {
  const [baseImage, setBaseImage] = useState("");
  const [muiId, setMuiId] = useState();
  const [errorField, setErrorField] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const userCookie = getCookie("user")
    
  },[]);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = e.target.files[0];
    const base64: Base64<"png" | "jpg" | "jpeg"> | any = await convertBase64(
      file
    );
    setBaseImage(base64);
  };

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const submitButton = async () => {
    
    const response = await fetch("http://localhost:24550/write_trainer", {
      method: "POST",
      body: JSON.stringify({ ...userData }),
      headers: {
        "Content-Type": "application/json",
        // accept: "application/json",
      },
    });
    const data = await response.json();
    if (response.status > 399) {
      let arr: any[] = [];
      data.detail.map((item: TypeErrorItem) => arr.push(...item.loc));
      setErrorField([...arr]);
    } else {
      // dispatch({ type: "AUTH", data: userData, route:"write_trainer" });
    }
  };
  return (
    <div className="flex-center-col">
      <span>{header}</span>
      <div className="flex-center-hor">
        <div className="flex-end-col mrg-5">
          <Avatar
            alt="Remy Sharp"
            sx={{ width: 120, height: 120 }}
            src={baseImage}
            style={{ marginBottom: "1rem", alignSelf: "center" }}
          />

          <Input
            error={errorField.join(" ").includes("image") ? true : false}
            id="standard-basic"
            type="file"
            onChange={(e) => {
              uploadImage(e);
              // setUserData({ ...userData, image: e.target.value });
            }}
            style={{ marginBottom: "1rem" }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            id="standard-basic"
            label="First Name"
            error={errorField.join(" ").includes("name") ? true : false}
            variant="standard"
            value={userData.name}
            onChange={(e) => {
              setUserData({ ...userData, name: e.target.value });
            }}
            style={{ marginBottom: "1rem" }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            error={errorField.join(" ").includes("surname") ? true : false}
            id="standard-basic"
            label="Last Name"
            variant="standard"
            value={userData.surname}
            onChange={(e) => {
              setUserData({ ...userData, surname: e.target.value });
            }}
            style={{ marginBottom: "1rem" }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            error={errorField.join(" ").includes("username") ? true : false}
            id="standard-basic"
            label="Nick Name"
            variant="standard"
            style={{ marginBottom: "1rem" }}
            value={userData.username}
            onChange={(e) => {
              setUserData({
                ...userData,
                user: { ...userData.user, username: e.target.value },
              });
            }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            error={errorField.join(" ").includes("email") ? true : false}
            id="standard-basic"
            label="email"
            variant="standard"
            style={{ marginBottom: "1rem" }}
            value={userData.email}
            onChange={(e) => {
              setUserData({
                ...userData,
                user: { ...userData.user, email: e.target.value },
              });
            }}
            sx={{ width: 200, input: { color: "white" } }}
          />
        </div>
        <div className="flex-end-col mrg-5">
          <TextField
            error={errorField.join(" ").includes("phone_number") ? true : false}
            id="standard-basic"
            label="Phone Number"
            variant="standard"
            style={{ marginBottom: "1rem" }}
            value={userData.phone_number}
            onChange={(e) => {
              setUserData({
                ...userData,
                phone_number: e.target.value,
              });
            }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            error={errorField.join(" ").includes("sex") ? true : false}
            id="standard-basic"
            style={{ marginBottom: "1rem" }}
            label="Sex"
            variant="standard"
            value={userData.sex}
            onChange={(e) => {
              setUserData({
                ...userData,
                sex: e.target.value,
              });
            }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            error={errorField.join(" ").includes("age") ? true : false}
            id="standard-basic"
            style={{ marginBottom: "1rem" }}
            label="Age"
            variant="standard"
            value={userData.age}
            onChange={(e) => {
              setUserData({
                ...userData,
                age: parseInt(e.target.value),
              });
            }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            error={errorField.join(" ").includes("password") ? true : false}
            id="standard-basic"
            style={{ marginBottom: "1rem" }}
            label="Password"
            variant="standard"
            value={userData.password}
            onChange={(e) => {
              setUserData({
                ...userData,
                user: { ...userData.user, password: e.target.value },
              });
            }}
            sx={{ width: 200, input: { color: "white" } }}
          />
          <TextField
            error={errorField.join(" ").includes("password") ? true : false}
            id="standard-basic"
            style={{ marginBottom: "1rem" }}
            label="Confirm Password"
            variant="standard"
            value={userData.confirmPassword}
            onChange={(e) => {
              setUserData({
                ...userData,
                user: { ...userData.user, password: e.target.value },
              });
            }}
            sx={{ width: 200, input: { color: "white" } }}
          />
        </div>
      </div>
      <Button className="w-50" onClick={submitButton}>
        Submit
      </Button>
    </div>
  );
};

export default SettingsFormComponent;
