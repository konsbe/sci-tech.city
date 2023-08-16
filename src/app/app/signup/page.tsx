import React from "react";
import Link from "next/link";
import SignUpForm from "@/src/components/SignUpForm";
import styles from "../styles/forms.module.css";

function signup() {
  return (
    <div className="body-container">
      <div className="form-container">
        <SignUpForm />
        <p className={styles.formtext}>
          already have an acount{" "}
          <span>
            <Link href="/login" className={styles.linkText}>
              Log in
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default signup;
