"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "../app/actions";
import { AuthContext } from "../providers/AuthProvider";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { EnumStatus, IMessage, TypeChats } from "../interfaces/chat";

// Create a context for the modal
const WebSocketContext = createContext<any>(null);
let stompClient: CompatClient | null = null;
const socketURL = "http://localhost:8081/ws";

const WebSocketProvider = ({ children }: any) => {
  const [callChats, setCallChats] = useState<any[]>([]);
  const [publicChats, setPublicChats] = useState<any[]>([]);
  const [privateChats, setPrivateChats] = useState<TypeChats>({});
  const [callData, setCallData] = useState<any>({
    callerName: "",
    receiverName: "",
  });

  const { userContextData, _ }: any = useContext(AuthContext);
  const [messageData, setMessageData] = useState({
    senderName: userContextData.username,
    receiverName: "",
    connected: true,
    message: "",
    status: EnumStatus[EnumStatus.MESSAGE],
  });

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
      onPrivateMessageReceived
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

  const [cookie, setCookie] = useState<string | null>(null);
  const fetchCookie = async () => {
    try {
      const result = await getCookie("access_token");
      setCookie(result?.value ?? null);
    } catch (error) {
      return null;
    }
  };

  const onMessageReceived = (payload: any) => {
    let payloadData = JSON.parse(payload.body);

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

  const onPrivateMessageReceived = async (payload: any) => {
    let payloadData = JSON.parse(payload.body);
    if (!payloadData) return;

    if (payloadData.message.includes('"type":"offer"')) {
      setCallData((prev: any) => {
        return {
          ...prev,
          callerName: payloadData.senderName,
          receiverName: userContextData.username,
        };
      });
      setCallChats((prevSet) => {
        // if (
        //   prevSet.find((r) => Object.keys(r).includes(payloadData.senderName))
        // )
        //   return [...prevSet];
        const obj = {
          [`${payloadData.senderName}`]: {
            offer: payloadData.message,
            candidates: [],
          },
        };
        return [...prevSet, obj];
      });
    } else if (
      payloadData.message.includes("candidate") &&
      payloadData.message.includes("host")
    ) {
      setCallChats((prevSet) => {
        const arr = prevSet.map((r) => {
          return Object.keys(r).includes(payloadData.senderName)
            ? {
                [`${payloadData.senderName}`]: {
                  offer: r[`${payloadData.senderName}`].offer,
                  candidates: [
                    ...r[`${payloadData.senderName}`].candidates,
                    payloadData.message,
                  ],
                },
              }
            : r;
        });
        return arr;
      });
    }
    if (payloadData.message.includes('"type":"answer"')) {
      const obj: any = JSON.parse(payloadData.message);
    }

    const chatRoom = payloadData.senderName;
    setPrivateChats((prev) => {
      return {
        ...prev,
        [`${chatRoom}`]: [
          ...prev[`${chatRoom}`],
          {
            ...payloadData,
            message: payloadData.message.includes('"type":"offer"')
              ? "call from user " + payloadData.senderName
              : payloadData.message,
          },
        ],
      };
    });
  };

  const sendValue = (
    messageReceiver: string = "chat.message",
    messageValue: string = messageData.message,
    messageReceiverName: string = messageData.receiverName
  ) => {
    if (stompClient) {
      let chatMessage = {
        senderName: userContextData.username,
        date: new Date(),
        message: messageValue,
        receiverName: messageReceiverName,
        status: EnumStatus[EnumStatus.MESSAGE],
      };
      if (
        privateChats[`${chatMessage.receiverName}`] &&
        chatMessage.receiverName !== chatMessage.senderName
      ) {
        // if (typeof chatMessage.message === 'object' || chatMessage.message.includes("answer")) {
        //   // if (callChats.find(obj => Object.keys(obj).includes(chatMessage.receiverName))) return;
        //   setCallChats((prevSet) => {
        //     // const chatCall = JSON.parse(chatMessage?.message);
        //     const obj = { [`${chatMessage.receiverName}`]: typeof chatMessage.message === 'string' ? JSON.parse(chatMessage?.message) : chatMessage?.message };
        //     return [...prevSet, obj]; // Return the new set
        //   });
        //   setPrivateChats((prev) => {
        //     return {
        //       ...prev,
        //       [`${chatMessage.receiverName}`]: [
        //         ...prev[`${chatMessage.receiverName}`],
        //         {
        //           ...chatMessage,
        //           message: "call user " + chatMessage.receiverName,
        //         },
        //       ],
        //     };
        //   });
        // } else if (chatMessage.message.includes('"type":"offer"')) {
        //   setCallChats((prevSet) => {
        //     const chatCall = JSON.parse(chatMessage?.message);
        //     const obj = { [`${chatCall.user.username}`]: chatCall.offer };
        //     return [...prevSet, obj]; // Return the new set
        //   });
        //   setPrivateChats((prev) => {
        //     return {
        //       ...prev,
        //       [`${chatMessage.receiverName}`]: [
        //         ...prev[`${chatMessage.receiverName}`],
        //         {
        //           ...chatMessage,
        //           message: "call user " + chatMessage.receiverName,
        //         },
        //       ],
        //     };
        //   });
        // } else {
        setPrivateChats((prev) => {
          return {
            ...prev,
            [`${chatMessage.receiverName}`]: [
              ...prev[`${chatMessage.receiverName}`],
              chatMessage,
            ],
          };
        });
        // }
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

    setMessageData((prev) => {
      return { ...prev, message: "" };
    });
  };

  const onError = (err: any) => {
    console.log("err: ", err);
  };

  useEffect(() => {
    fetchCookie();

    if (typeof window !== "undefined") {
      connect();
    }
  }, [userContextData]);

  // Value to be provided by the context
  const state = {
    stompClient,
    callData,
    setCallData,
    callChats,
    setCallChats,
    privateChats,
    messageData,
    setMessageData,
    handlePushMessage,
    cookie,
    sendValue,
  };

  return (
    <WebSocketContext.Provider value={state}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
