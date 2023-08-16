import React from "react";
import Link from "next/link";
import LoginForm from "@/src/components/LogInForm";
import styles from "../styles/forms.module.css";

function login() {
  return (
    <div className="body-container">
      <div className="form-container">
        <p className={styles.formtext}>
          not an acount{" "}
          <span>
            <Link href="/signup" className={styles.linkText}>
              Sign Up
            </Link>
          </span>
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

export default login;
