"use client";
import React from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./Navbar.module.css";
import { Button } from "@mui/material";
import { loginButton, logoutButton } from "./options";
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const router = useRouter();
  
  return (
    <nav className={styles.navbar}>
      <a>
        <Avatar sx={{ml: 2}} alt={"k"}></Avatar>
      </a>
      <a>
        <Button
          onClick={() => router.push('/login')}
          sx={{ my: 2, color: "white" }}
          className={styles.colorButtons}>
          {loginButton[0].icon}
        </Button>
      </a>
    </nav>
  );
};
