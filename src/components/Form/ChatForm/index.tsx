"use client";
import React, { useCallback, useEffect, useState } from "react";


const ChatForm = ({ userProps, handlePushMessage, videoStream }: any) => {



  return (
    <div className="chat-form">
      <textarea
        name="chatMessage"
        value={userProps.messageData.message}
        className="form-input"
        onChange={(e: any) =>
          userProps.setMessageData((prev: any) => {
            return { ...prev, message: e.target.value };
          })
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlePushMessage(userProps.messageData);
          }
        }}
      />
      <div className="chat-button-group">
        <button
          className="chat-button"
          onClick={() => handlePushMessage(userProps.messageData)}
          >
          Send
        </button>
        <button className="camera-button" onClick={() => videoStream.callButtonOnClick()}>
          Call
        </button>
      </div>
    </div>
  );
};

export default ChatForm;
