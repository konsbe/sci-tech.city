"use client";
import React, { useEffect, useState } from "react";
import styles from "@/src/styles/Home.module.css";
import Cube from "@/src/components/Cube";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Mail";
import { homeOptions } from "./homeOptions";
import { createCookie } from "../app/actions";

export default function Home() {
  useEffect(() => {
    createCookie(null);
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className="body-container">
      <div className={styles.container}>
        <div className={styles.cubeInfo}>
          <div>
            {/* <button
              onClick={() =>
                setCurrentIndex(currentIndex === 0 ? 6 : currentIndex - 1)
              }>
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentIndex(currentIndex === 6 ? 0 : currentIndex + 1)
              }>
              Next
            </button> */}
          </div>
          <Cube
            isModal={false}
            frontHeader="Full Stack Node.js Engineer"
            frontDescription="Full Stack Node.js Engineer"
            frontIcon={GitHubIcon}
            upHeader="Full Stack Node.js Engineer"
            upDescription="Small Description Engineer"
            upIcon={LinkedInIcon}
            downHeader="Down Side"
            downDescription={"small description"}
            rightHeader="Full Stack Node.js Engineer"
            rightDescription="Small Description Engineer"
            rightIcon={MailIcon}
            leftHeader="Left Side"
            leftDescription="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi,
            quas?"
            backHeader="Back Side"
            backDescription={"small description"}
            backImg="https://scontent.fath7-1.fna.fbcdn.net/v/t39.30808-6/265919608_369729944951941_4739354972702184605_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=e3f864&_nc_eui2=AeGPiyB9s7VK5ET1OTZSHogV_4DyXruBFMr_gPJeu4EUyjr-J8upnK4apaDfoNbjHGWWSZ4sO6kWHREZ5spJaqKN&_nc_ohc=VWSVqAroN1gAX82aB8k&_nc_ht=scontent.fath7-1.fna&oh=00_AfDXoOWSdAu3uN_18sfgz2YSNvAG9MrCcp_OqTd8unBQtA&oe=644460C1"
          />
        </div>
        <div className={styles.homeDescription}>
          <div className="scrollbar-container">
            <div className="scrollbar-content">
              <p className="scroll-text">{`${homeOptions[0]}`}</p>
              <p className="scroll-text">{`${homeOptions[1]}`}</p>
              <p className="scroll-text">{`${homeOptions[2]}`}</p>
              <p className="scroll-text">{`${homeOptions[3]}`}</p>
              <p className="scroll-text">{`${homeOptions[4]}`}</p>
              <p className="scroll-text">{`${homeOptions[5]}`}</p>
            </div>
          </div>
          {/* <div
            className="carousel-container"
            style={{ height: "400px", position: "relative" }}>
            {homeOptions.map((item, index) => {
              const classes = [];
              if (index === currentIndex) {
                classes.push("active");
              } else if (index === currentIndex - 1) {
                classes.push("previous");
              } else if (index === currentIndex + 1) {
                classes.push("next");
              }
              return (
                <div
                  key={index}
                  className={`carousel-item ${classes.join(" ")}`}>
                  {item}
                </div>
              );
            })}
          </div> */}
          <p>https://github.com/konsbe</p>
        </div>
      </div>
    </div>
  );
}
