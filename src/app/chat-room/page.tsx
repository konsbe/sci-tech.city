import React, { useState } from "react";
import "./chatRoom.css";
import ChatForm from "@/src/components/Form/ChatForm";
import ButtonForm from "@/src/components/Form/ButtonForm";
import { Button } from "@mui/material";
import Modal from "@/src/components/Modal";
import CreateRoom from "@/src/components/Form/CreateRoom";
import CreateFormButton from "@/src/components/Form/CreatRoomButton";
let fuck = "fuck";

function ChatRoom() {
  fuck += " chatRoom";
  const headers = [{ name: "User-Agent" }, { name: "User-Agent-2" }];

  return (
    <div className="body-container">
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
    </div>
  );
}

export default ChatRoom;
