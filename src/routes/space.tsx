"use client";
import React, { useContext, useEffect, useState } from "react";
import CreateFormButton from "../components/Form/CreatRoomButton";
import ChatForm from "../components/Form/ChatForm";
import CreateRoom from "../components/Form/CreateRoom";
import LoginForm from "../components/LogInForm";
import { getCookie } from "../app/actions";
import Link from "next/link";
import { AuthContext } from "../providers/AuthProvider";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { TypeChats } from "../interfaces/chat";

let stompClient: CompatClient | null = null;
const socketURL = "http://localhost:8081/ws";

export const SpaceComponent = () => {
  const [publicChats, setPublicChats] = useState<any[]>([]);
  const [privateChats, setPrivateChats] = useState<TypeChats>({});

  const { userContextData, _ }: any = useContext(AuthContext);
  const [messageData, setMessageData] = useState({
    username: userContextData.username,
    receiverName: "",
    connected: true,
    message: "",
    status: "MESSAGE",
  });

  const [cookie, setCookie] = useState<string | null>(null);
  const fetchCookie = async () => {
    try {
      const result = await getCookie("access_token");
      setCookie(result?.value ?? null);
    } catch (error) {
      return null;
    }
  };
  const connect = () => {
    try {
      if (userContextData.username) {
        var socket = new SockJS(socketURL);
        stompClient = Stomp.over(socket);
        // stompClient.debug = () => {};
        // stompClient = over(socket);
        // let stompClient = Stomp.client(socketURL);

        stompClient.connect({}, onConnected, onError);
      }
    } catch (error) {
      console.error("Error connecting to WebSocket server:", error);
    }
  };

  const onConnected = () => {
    stompClient?.subscribe("/chatroom/public", onMessageReceived);
    stompClient?.subscribe(
      "/user/" + userContextData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    let chatMessage = {
      senderName: userContextData.username,
      message: `...${userContextData.username} join`,
      date: new Date(),
      receiverName: "",
      status: "JOIN",
    };

    // stompClient?.send("/app/chat.message", {}, JSON.stringify(chatMessage));
    stompClient?.send("/chatroom/public", {}, JSON.stringify(chatMessage));
    stompClient?.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));
  };

  const userLeave = (username: string) => {
    let chatMessage = {
      senderName: userContextData.username,
      message: `...${userContextData.username} left`,
      date: new Date(),
      receiverName: "",
      status: "LEAVE",
    };
    // stompClient?.send("/app/chat.message", {}, JSON.stringify(chatMessage));
    // stompClient?.send("/chatroom/public", {}, JSON.stringify(chatMessage));
    stompClient?.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload: any) => {
    var payloadData = JSON.parse(payload.body);
    console.log("onMessageReceived....: ", payloadData);

    switch (payloadData.status) {
      case "JOIN":
        payloadData?.connctedUsers.map((entry: string) => {
          if (!privateChats[`${entry}`]) {
            setPrivateChats((prev) => {
              return { ...prev, [`${entry}`]: [] };
            });
          }
        });
        break;
      case "LEAVE":
        const leftUser = payloadData.senderName;
        setPrivateChats((prev) => {
          const { [`${leftUser}`]: deletedProperty, ...rest } = prev; // Use object destructuring to remove the property
          return rest;
        });
        break;
      case "MESSAGE":
        if (!payloadData) return;
        setPublicChats((prev) => {
          return [...prev, payloadData];
        });
        break;
      default:
        break;
    }
  };

  const onPrivateMessage = (payload: any) => {
    console.log("onPrivateMessage: ", payload);

    var payloadData = JSON.parse(payload.body);

    // setPrivateChats((prev) => {
    //   return [...prev, payloadData];
    // });
  };

  const onError = (err: any) => {
    console.log("err: ", err);
  };

  const sendValue = (messageReceiver: string = "chat.message") => {
    if (stompClient) {
      let chatMessage = {
        senderName: userContextData.username,
        date: new Date(),
        message: messageData.message,
        receiverName: messageData.receiverName,
        status: "MESSAGE",
      };

      stompClient?.send(
        `/app/${messageReceiver}`,
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  const handlePushMessage = (item: any) => {
    sendValue("private.message");
    console.log("publicChats: ", publicChats);

    setMessageData({ ...messageData, message: "" });
  };

  useEffect(() => {
    fetchCookie();

    if (typeof window !== "undefined") {
      connect();
    }
  }, []);
  console.log("privateChats: ", privateChats);

  return cookie ? (
    <>
      <div className="chat-room-container">
        {/* <div>Chat-Room</div> */}
        <div className="chat-room-sidebar">
          <CreateFormButton />
          {Object.keys(privateChats)?.map((item: string, index: number) => (
            <div
              key={index}
              className="chat-room-header"
              onClick={() =>
                setMessageData((prev) => {
                  return { ...prev, receiverName: item };
                })
              }>
              <span>{item}</span>
            </div>
          ))}
          {/* <OnlineSubscribers onlineSubscribedUsers={onlineSubscribedUsers} /> */}
        </div>
        <div className="chat-container">
          <div className="chat-inbox"></div>
          <ChatForm
            userProps={{ messageData, setMessageData }}
            handlePushMessage={handlePushMessage}
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
