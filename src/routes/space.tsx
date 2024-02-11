"use client";
import React, { useContext } from "react";
import CreateFormButton from "../components/Form/CreatRoomButton";
import ChatForm from "../components/Form/ChatForm";
import CreateRoom from "../components/Form/CreateRoom";
import LoginForm from "../components/LogInForm";
import Link from "next/link";
import { AuthContext } from "../providers/AuthProvider";
import { IMessage } from "../interfaces/chat";
import CallIcon from "@mui/icons-material/Call";
import { WebSocketContext } from "../providers/WebSocketProvider";
import VideoComponent from "../components/VideoComponent";
import { WebRTCContext } from "../providers/WebRTCProvider";

export const SpaceComponent = () => {
  const { userContextData, _ }: any = useContext(AuthContext);
  const {
    callData,
    callChats,
    privateChats,
    messageData,
    setMessageData,
    handlePushMessage,
    cookie,
  }: any = useContext(WebSocketContext);
  const {
    remoteStream,
    localStream,
    webcamButtonOnClick,
    callButtonOnClick,
    answerButtonOnClick,
    isMyCameraEnabled,
    toggleMicrophone,
    isMicEnabled,
    shareScreenButtonOnClick,
    isScreenSharing,
    closeCallOnClick,
    shareScreenStream,
  }: any = useContext(WebRTCContext);

  return cookie ? (
    <>
      <div className="chat-room-container">
        <div className="chat-room-sidebar">
          <CreateFormButton />
          {Object.keys(privateChats)?.map((item: string, index: number) => (
            <div
              key={index}
              className={`chat-room-header ${
                messageData.receiverName === item ? "chatroom-active" : ""
              }`}
              onClick={() =>
                setMessageData((prev: any) => {
                  return { ...prev, receiverName: item };
                })
              }>
              <span>{item}</span>
              {callChats?.some((obj: any) => Object.keys(obj)[0] === item) ? (
                <div>
                  <CallIcon
                    className={
                      !localStream
                        ? "has-call-sidebar-button"
                        : "is-in-call-sidebar-button"
                    }
                    onClick={() =>
                      !remoteStream ? answerButtonOnClick(item, callChats) : {}
                    }
                  />
                  {/* <CallIcon
                    className="reject-call-sidebar-button"
                    onClick={() => rejectButtonOnClick(item, callChats)}
                  /> */}
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        <div className="chat-container">
          <div className="chat-inbox-container">
            <div className="chat-inbox">
              <div className="fixed-center flex-center-col">
                <div>
                  <button
                    id="webcamButton"
                    onClick={() => webcamButtonOnClick(true, true)}>
                    {isMyCameraEnabled ? "Disable Camera" : "Enable Camera"}
                  </button>
                  <button
                    id="callButton"
                    onClick={
                      Boolean(
                        callChats.find((r: any) =>
                          Object.keys(r).includes(messageData.receiverName)
                        )
                      )
                        ? () =>
                            answerButtonOnClick(
                              messageData.receiverName,
                              callChats
                            )
                        : callButtonOnClick
                    }
                    disabled={
                      Boolean(remoteStream) ||
                      Boolean(callData.callerName === userContextData.username)
                    }>
                    {Boolean(
                      callChats.find((r: any) =>
                        Object.keys(r).includes(messageData.receiverName)
                      )
                    ) && !(callData.callerName === userContextData.username)
                      ? "Answer"
                      : "Call"}
                  </button>
                </div>
                <div>
                  <button
                    id="microphoneButton"
                    onClick={() => toggleMicrophone()}
                    disabled={!localStream}>
                    {isMicEnabled ? "Disable Mic" : "Enable Mic"}
                  </button>
                  <button
                    id="shareScreen"
                    onClick={() => shareScreenButtonOnClick()}
                    disabled={!localStream}>
                    {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                  </button>
                  {remoteStream && (
                    <button
                      id="closeButton"
                      onClick={
                        () =>
                          closeCallOnClick(messageData.receiverName, callChats)
                        // rejectButtonOnClick(messageData.receiverName, callChats)
                      }
                      disabled={!localStream}>
                      Close Call
                    </button>
                  )}
                </div>
              </div>

              {privateChats[`${messageData.receiverName}`]?.map(
                (item: IMessage, index: number) => (
                  <div key={index} className="message-box">
                    <div
                      className={`message-item ${
                        item.senderName === userContextData.username
                          ? "my-message-item"
                          : ""
                      } `}>
                      {item.message}
                    </div>
                    <span
                      className={`message-sender ${
                        item.senderName === userContextData.username
                          ? "true-user"
                          : ""
                      }`}>
                      {item.senderName}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <ChatForm
            userProps={{ messageData, setMessageData }}
            handlePushMessage={handlePushMessage}
            videoStream={{ callButtonOnClick }}
          />
        </div>
        <div className="video-container">
            <VideoComponent
              stream={isScreenSharing || shareScreenStream ? shareScreenStream : localStream}
              title={userContextData.username}
            />
            <VideoComponent
              stream={remoteStream}
              title={messageData.receiverName}
            />
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
