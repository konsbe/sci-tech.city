"use client";
import { IPostInfo, IResponseData } from "../interface";

import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import Comment from "../Comment";
import CommentForm from "../Comment/commentForm";

import styles from "@/src/styles/blog.module.css";

import { IComment } from "../interface";
const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

const blogs = [{ author: "k boner", title:"sci-teck", post:"First post on my page" }];
const comments = [{ comment: "asd" }];
function Blog(props:any): JSX.Element {
  const blog = blogs[0]
  return (
    <div style={{ padding: "40px 20px",   backgroundColor: "rgba(255, 255, 255, 0.2)"}}>
        <div>
          <Avatar alt="Remy Sharp" src={imgLink} />
        </div>
        <div>
          <h5>{blog.author}</h5>
        </div>
      <div>
        <h5>{blog.title}</h5>
      </div>
      <div>
        <div>{blog.post}</div>
      </div>
      {comments.map((comment, index) => {
        return <div key={index}>{comment.comment}</div>;
      })}
      <Comment />
      {/* <CommentForm blogId={blog?.id} /> */}
    </div>
  );
}

export default Blog;
