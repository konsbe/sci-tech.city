"use client";
import React, { ProviderProps, createContext, useState } from "react";
import { createCookie } from "../app/actions";

const IContextUserState: UserPropTypes = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  userId: "",
};

export type UserPropTypes = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userId: string;
};

const AuthContext = createContext<ProviderProps<Partial<UserPropTypes>>>({
  value: {},
});

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }: any) => {
  const [userContextData, setUserContextData] =
    useState<UserPropTypes>(IContextUserState);

  const state :any = {
    userContextData,
    setUserContextData,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
