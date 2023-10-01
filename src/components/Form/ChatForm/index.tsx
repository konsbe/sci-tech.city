"use client";
import React, { useState } from "react";

const ChatForm = ({ userProps, handlePushMessage }: any) => {

  return (
    <div className="chat-form">
      <textarea
        name="chatMessage"
        value={userProps.messageData.message}
        className="form-input"
        onChange={(e: any) =>
          userProps.setMessageData((prev:any) => {return {...prev, message: e.target.value}})
        }
      />
      <button className="chat-button" onClick={() => handlePushMessage(userProps.messageData)}>Button</button>
    </div>
  );
};

export default ChatForm;
