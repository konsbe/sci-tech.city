"use client";
import React, { createContext, useState } from "react";
import { createCookie } from "../app/actions";

const IContextUserState: IContextProps = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  userId: "",
};

export type IContextProps = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userId: string;
};

const AuthContext = createContext<Partial<IContextProps>>({});

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }: any) => {

  const [userContextData, setUserContextData] =
    useState<IContextProps>(IContextUserState);
  
    const state: any = {
    userContextData,
    setUserContextData,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
