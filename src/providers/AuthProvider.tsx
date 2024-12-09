"use client";
import React, {
  ProviderProps,
  createContext,
  useEffect,
  useState,
} from "react";
import { createCookie } from "../app/actions";

const IContextUserState: UserPropTypes = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  profilePicture: "",
  userId: "",
  cookie: "",
};

export type UserPropTypes = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profilePicture: string;
  userId: string;
  cookie: Object,
};

const AuthContext = createContext<ProviderProps<Partial<UserPropTypes>>>({
  value: {},
});

function decodeJWT(token: string) {
  const base64Url = token?.split('.')[1]; // The second part of the token is the payload
  const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/'); // Base64Url to Base64
  if (base64) {
    const decodedString = atob(base64); // Decode the Base64 string
    return JSON.parse(decodedString); // Parse and return the JSON object
  } else return null;
}



const AuthProvider: React.FC<any> = ({ children, ...props }: any) => {
  const [userContextData, setUserContextData] =
    useState<UserPropTypes>(IContextUserState);

  const authCooieDecode = props.cookie ? decodeJWT(props.cookie[0]?.value) : null;

  useEffect(() => {

    if (props.cookie[0]?.value) {
      
      // Assuming the cookie contains user information in JSON format 
      setUserContextData((prev) => {
        return {
          ...prev,
          lastName: authCooieDecode?.family_name || '',
          email:authCooieDecode?.email || '',
          username: authCooieDecode?.preferred_username || '',
          firstName:authCooieDecode?.preferred_username || '',
          cookie: props.cookie[0]?.value || '',
        };
      });
      
    }
    if (typeof window === "undefined") return;
    
    setUserContextData((prev) => {
      return {
        ...prev,
        profilePicture: String(
          localStorage.getItem("image_type") +
            "," +
            localStorage.getItem("image")
        ),
      };
    });
  }, []);

  const state: any = {
    userContextData,
    setUserContextData,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
