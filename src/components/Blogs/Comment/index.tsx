import { Avatar } from "@mui/material";
import React from "react";
import styles from "@/src/styles/blog.module.css";

const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

function Comment(props: any) {
  return (
    <div className={styles.commentSection}>
      <div>
        <Avatar alt="Remy Sharp" src={imgLink} />
      </div>
      <div className={styles.comments}></div>
    </div>
  );
}

export default Comment;
