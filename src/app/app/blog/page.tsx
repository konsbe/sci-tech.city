"use client"
import React, { useState } from "react";
import styles from "@/src/styles/blog.module.css";
import "./blog.css";

// const Blogs = dynamic(() => import("@/src/components/Blogs"));
import Blogs from "@/src/components/Blogs";
import BlogForm from "@/src/components/Blogs/BlogForm";
import ProjectsForm from "@/src/components/ProjectsForm";

function Blog() {
  const [currentId, setCurrentId] = useState<any>(0);

  return (
    <div className="body-container">
      <div className="blog-container">
        <div className={styles.container}>
          <div className={styles.bodyContainer}>
            <div className={styles.gridContainer}>
              <div>
                <div className={styles.containerForm}>
                  {/* <BlogForm className={styles.containerForm} /> */}
                </div>
                <div className={styles.containerBlog}>
                  {/* <Blogs className={styles.containerBlog} /> */}
                  <ProjectsForm currentId={currentId} setCurrentId={setCurrentId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;