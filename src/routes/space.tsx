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
import { Client, over } from "stompjs";
import { CompatClient, Stomp } from "@stomp/stompjs";

let stompClient: CompatClient | null = null;
const socketURL = "http://localhost:8081/ws";

export const SpaceComponent = () => {
  const [onlineSubscribedUsers, setOnlineSubscribedUsers] = useState<any>([]);
  const [privateChats, setPrivateChats] = useState(new Map());
  const headers = [{ name: "User-Agent" }, { name: "User-Agent-2" }];
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

  const onConnected = (dt: any) => {
    stompClient?.subscribe("/chatroom/public", onMessageReceived);
    stompClient?.subscribe(
      "/user/" + userContextData.username + "/private",
      onPrivateMessage
    );
    userJoin();
    console.log("dt: ", dt);
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
      senderName: username,
      message: `...${userContextData.username} left`,
      date: new Date(),
      receiverName: "",
      status: "LEAVE",
    };

    // stompClient?.send("/app/chat.message", {}, JSON.stringify(chatMessage));
    stompClient?.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload: any) => {
    console.log("onMessageReceived....: ", payload);

    var payloadData = JSON.parse(payload.body);
    console.log("payloadData: ", payloadData);

    switch (payloadData.status) {
      case "JOIN":
        console.log("JOIN: JOIN");
        break;
      case "LEAVE":
        const leftUser = payloadData.senderName;
        userLeave(payloadData.senderName);
        setOnlineSubscribedUsers((prev: any) => [
          prev?.filter((user: any) => user !== leftUser),
        ]);
        break;
      case "MESSAGE":
        if (!payloadData) return;
        break;
      default:
        setOnlineSubscribedUsers(payloadData?.connctedUsers);
        break;
    }
  };

  const onPrivateMessage = (payload: any) => {
    console.log("onPrivateMessage: ", payload);

    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const sendValue = (messageReceiver:string = "chat.message") => {
    if (stompClient) {
      let chatMessage = {
        senderName: userContextData.username,
        date: new Date(),
        message: messageData.message,
        receiverName: messageData.receiverName,
        status: "MESSAGE",
      };
  
      stompClient?.send(`/app/${messageReceiver}`, {}, JSON.stringify(chatMessage));
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userContextData.username,
        message: userContextData.message,
        date: new Date(),
        receiverName: "recieverName",
        status: "MESSAGE",
      };

      // if (userContextData.username !== tab) {
      //   privateChats.get(tab).push(chatMessage);
      //   setPrivateChats(new Map(privateChats));
      // }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      // setUserData({ ...userData, message: "" });
    }
  };
  const handlePushMessage = (item: any) => {
    sendValue("private.message");
    setMessageData({ ...messageData, message: "" });
  };

  useEffect(() => {
    fetchCookie();

    if (typeof window !== "undefined") {
      connect();
    }
  }, []);

  return cookie ? (
    <>
      <div className="chat-room-container">
        {/* <div>Chat-Room</div> */}
        <div className="chat-room-sidebar">
          <CreateFormButton />
          {onlineSubscribedUsers?.map((item: string, index: number) => (
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
