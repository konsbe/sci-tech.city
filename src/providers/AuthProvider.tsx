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
};

export type UserPropTypes = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profilePicture: string;
  userId: string;
};

const AuthContext = createContext<ProviderProps<Partial<UserPropTypes>>>({
  value: {},
});

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }: any) => {
  const [userContextData, setUserContextData] =
    useState<UserPropTypes>(IContextUserState);

  useEffect(() => {
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
