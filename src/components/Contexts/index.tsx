import { createContext, useState } from "react";

const IContextUserState: IContextProps = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  userId: "",
};

type IContextProps = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userId: string;
};
export const LoginContext = createContext<Partial<IContextProps>>({});

export const AuthWrapperContext: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [userContextData, setUserContextData] =
    useState<IContextProps>(IContextUserState);
  const state: any = {
    userContextData,
    setUserContextData,
  };
  return (
    <LoginContext.Provider value={state}>{children}</LoginContext.Provider>
  );
};
export default AuthWrapperContext;
