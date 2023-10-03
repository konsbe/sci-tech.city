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
import { EnumStatus, IMessage, TypeChats } from "../interfaces/chat";

let stompClient: CompatClient | null = null;
const socketURL = "http://localhost:8081/ws";

export const SpaceComponent = () => {
  const [publicChats, setPublicChats] = useState<any[]>([]);
  const [privateChats, setPrivateChats] = useState<TypeChats>({});

  const { userContextData, _ }: any = useContext(AuthContext);
  const [messageData, setMessageData] = useState({
    senderName: userContextData.username,
    receiverName: "",
    connected: true,
    message: "",
    status: EnumStatus[EnumStatus.MESSAGE],
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
        const socket = new SockJS(socketURL);
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
      status: EnumStatus[EnumStatus.JOIN],
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
      status: EnumStatus[EnumStatus.LEAVE],
    };
    // stompClient?.send("/app/chat.message", {}, JSON.stringify(chatMessage));
    // stompClient?.send("/chatroom/public", {}, JSON.stringify(chatMessage));
    stompClient?.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);

    switch (payloadData.status) {
      case EnumStatus[EnumStatus.JOIN]:
        payloadData?.connctedUsers.map((entry: string) => {
          if (!privateChats[`${entry}`]) {
            setPrivateChats((prev) => {
              return { ...prev, [`${entry}`]: [] };
            });
          }
        });
        break;
      case EnumStatus[EnumStatus.LEAVE]:
        const leftUser = payloadData.senderName;
        setPrivateChats((prev) => {
          const { [`${leftUser}`]: deletedProperty, ...rest } = prev; // Use object destructuring to remove the property
          return rest;
        });
        break;
      case EnumStatus[EnumStatus.MESSAGE]:
        if (!payloadData) return;
        const chatRoom = payloadData.senderName;
        if (
          privateChats[`${chatRoom}`] &&
          userContextData.username !== privateChats[`${chatRoom}`]
        ) {
          setPrivateChats((prev) => {
            return {
              ...prev,
              [`${chatRoom}`]: [...prev[`${chatRoom}`], payloadData],
            };
          });
        }
        break;
      default:
        break;
    }
  };

  const onPrivateMessage = (payload: any) => {
    const payloadData = JSON.parse(payload.body);

    if (!payloadData) return;
    const chatRoom = payloadData.senderName;
    if (privateChats[`${chatRoom}`]) {
      setPrivateChats((prev) => {
        return {
          ...prev,
          [`${chatRoom}`]: [...prev[`${chatRoom}`], payloadData],
        };
      });
    }
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
        status: EnumStatus[EnumStatus.MESSAGE],
      };
      if (privateChats[`${chatMessage.receiverName}`]) {
        setPrivateChats((prev) => {
          return {
            ...prev,
            [`${chatMessage.receiverName}`]: [
              ...prev[`${chatMessage.receiverName}`],
              chatMessage,
            ],
          };
        });
      }

      stompClient?.send(
        `/app/${messageReceiver}`,
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  const handlePushMessage = (item: any) => {
    sendValue("private.message");

    setMessageData({ ...messageData, message: "" });
  };
  console.log("privateChats: ", privateChats);

  useEffect(() => {
    fetchCookie();

    if (typeof window !== "undefined") {
      connect();
    }
  }, [cookie]);

  return cookie ? (
    <>
      <div className="chat-room-container">
        {/* <div>Chat-Room</div> */}
        <div className="chat-room-sidebar">
          <CreateFormButton />
          {Object.keys(privateChats)?.map((item: string, index: number) => (
            <div
              key={index}
              className={`chat-room-header ${
                messageData.receiverName === item ? "chatroom-active" : ""
              }`}
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
          <div className="chat-inbox-container">
          <div className="chat-inbox">
            {privateChats[`${messageData.receiverName}`]?.map(
              (item: IMessage, index: number) => (
                <div key={index} className="message-box">
                  <div
                    className={`message-item ${
                      item.senderName === userContextData.username
                        ? "my-message-item"
                        : ""
                    }`}>
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
