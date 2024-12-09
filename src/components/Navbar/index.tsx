"use client";
import React, { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./Navbar.module.css";
import { Button } from "@mui/material";
import { loginButton, logoutButton } from "./options";
import { usePathname, useRouter } from "next/navigation";
import { decodeToken, logout } from "@/src/app/actions";
import { AuthContext } from "@/src/providers/AuthProvider";
import { WebSocketContext } from "@/src/providers/WebSocketProvider";
import CallIcon from "@mui/icons-material/Call";
import { ModalContext } from "@/src/providers/ModalProvider";

export const Navbar = (props: any) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | any>(null); // Initialize state with null or an appropriate initial value
  const pathname = usePathname();
  const { userContextData, setUserContextData }: any = useContext(AuthContext);
  const { callChats }: any = useContext(WebSocketContext);
  const calls = [...new Set([...callChats])]
  const { closeModal } = useContext(ModalContext);
  
  useEffect(() => {
    !accessToken && setAccessToken(props.cookie[0]?.value)
    decodeToken(accessToken).then((payload) => {
      if (!payload) return;
      setUserContextData({
        ...userContextData,
        firstName: payload?.preferred_username || "",
        lastName: payload?.given_name || "",
        email: payload?.email || "",
        username: payload?.preferred_username || "",
        profilePicture: String(String(localStorage.getItem("image_type")).replace(/"/g, '') + "," + String(localStorage.getItem("image")).replace(/"/g, '')),
        userId: payload?.sub || "",
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, accessToken]);
  
  return (
    <nav className={styles.navbar} onClick={closeModal}>
      <a className={styles.btn}>
        <Avatar src={userContextData.profilePicture} onClick={() => router.push("/profile")} sx={{ ml: 2 }} alt={userContextData.email[0]}></Avatar>
      </a>
      <a style={{color:'white'}}>
      {userContextData.username}
      </a>
      <div className="nav-bar-call-notifications">
        {calls.map((call, index) => {
          return (<div className="nav-bar-call-notification" key={index}>
                    <CallIcon className={"has-call-sidebar-button"}/>
                  <div>
                    {Object.keys(call)[0]}
                  </div>
        </div>)
        })}
      </div>
      <a>
        <Button
          onClick={() =>
            !accessToken
              ? router.push("/login")
              : logout().then(() => router.push("/login" ))}
          sx={{ my: 2, color: "white" }}
          className={styles.colorButtons}>
          {!accessToken ? loginButton[0].icon : logoutButton[0].icon}
        </Button>
      </a>
    </nav>
  );
};
