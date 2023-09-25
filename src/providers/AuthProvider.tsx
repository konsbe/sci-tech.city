"use client";
import React, { createContext, useState } from "react";
import { createCookie } from "../app/actions";

const ModalContext = createContext<any>(null);

const AuthProvider = ({ children }: any) => {
  const [hasCookie, setHasCookie] = useState(false);

  const cookieFactory = () => {
    createCookie(null);
    setHasCookie(false);
  };

  const modalValue = {
    hasCookie,
    setHasCookie,
    cookieFactory,
  };

  return (
    <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>
  );
};

export { ModalContext, AuthProvider };
