"use client";
import React, { useState } from "react";

const ChatForm = () => {
  const [chatMessage, setChatMessage] = useState<string>();

  return (
    <div className="chat-form">
        <textarea
          name="chatMessage"
          value={chatMessage}
          className="form-input"
          // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          //   setChatMessage(e.target.value)
          // }
          
        />
        <button className="chat-button">Button</button>
    </div>
  );
};

export default ChatForm;
