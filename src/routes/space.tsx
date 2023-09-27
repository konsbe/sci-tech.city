"use client";
import React, { useContext, useEffect, useState } from "react";
import CreateFormButton from "../components/Form/CreatRoomButton";
import ChatForm from "../components/Form/ChatForm";
import CreateRoom from "../components/Form/CreateRoom";
import LoginForm from "../components/LogInForm";
import { getCookie } from "../app/actions";
import Link from "next/link";
import { AuthContext } from "../providers/AuthProvider";

export const SpaceComponent = () => {
  const headers = [{ name: "User-Agent" }, { name: "User-Agent-2" }];
  const {userContextData, _ }: any = useContext(AuthContext);


  const [cookie, setCookie] = useState<string | null>(null);
  const fetchCookie = async () => {
    try {
      const result = await getCookie("access_token");
      setCookie(result?.value ?? null);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    fetchCookie();
    
  }, []);

  return cookie ? (
    <>
      <div className="chat-room-container">
        {/* <div>Chat-Room</div> */}
        <div className="chat-room-sidebar">
          <CreateFormButton />
          {headers.map((item, index) => {
            return (
              <div key={index} className="chat-room-header">
                {item.name}
              </div>
            );
          })}
        </div>
        <div className="chat-container">
          <div className="chat-inbox"></div>
          <ChatForm />
        </div>
      </div>
      <CreateRoom />
    </>
  ) : (
    <div className="body-container">
      <div className="form-container">
        <p className="formtext">
          not an acount to see SPACE content{" "}
          <span>
            <Link href="/signup" className="linkText">
              Sign Up
            </Link>
          </span>
        </p>
        <LoginForm />
      </div>
    </div>
  );
};
export default SpaceComponent;
