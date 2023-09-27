"use client";
import React, { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./Navbar.module.css";
import { Button } from "@mui/material";
import { loginButton, logoutButton } from "./options";
import { usePathname, useRouter } from "next/navigation";
import { decodeToken, getCookie, logout } from "@/src/app/actions";
import { AuthContext } from "@/src/providers/AuthProvider";

export const Navbar = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | any>(null); // Initialize state with null or an appropriate initial value
  const pathname = usePathname();
  const { userContextData, setUserContextData }: any = useContext(AuthContext);

  const fetchCookie = async () => {
    try {
      const result = await getCookie("access_token");
      setAccessToken(result?.value ?? null);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchCookie();
    decodeToken(accessToken).then((payload) => {
      if (!payload) return;
      setUserContextData({
        ...userContextData,
        firstName: payload?.family_name || "",
        lastName: payload?.given_name || "",
        email: payload?.email || "",
        username: payload?.preferred_username || "",
        userId: payload?.sub || "",
      });
    });
  }, [pathname, accessToken]);

  return (
    <nav className={styles.navbar}>
      <a className={styles.btn}>
        <Avatar onClick={() => router.push("/profile")} sx={{ ml: 2 }} alt={"k"}></Avatar>
      </a>
      <a>
        <Button
          onClick={() =>
            !accessToken
              ? router.push("/login")
              : logout().then(() => router.push("/login"))
          }
          sx={{ my: 2, color: "white" }}
          className={styles.colorButtons}>
          {!accessToken ? loginButton[0].icon : logoutButton[0].icon}
        </Button>
      </a>
    </nav>
  );
};
