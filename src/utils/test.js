
  // const [messageData, setMessageData] = useState({
  //   senderName: userContextData.username,
  //   receiverName: "",
  //   connected: true,
  //   message: "",
  //   status: EnumStatus[EnumStatus.MESSAGE],
  // });

  // const connect = () => {
  //   try {
  //     if (userContextData.username) {
  //       const socket = new SockJS(socketURL);
  //       stompClient = Stomp.over(socket);
  //       // stompClient.debug = () => {};
  //       // stompClient = over(socket);
  //       // let stompClient = Stomp.client(socketURL);

  //       stompClient.connect({}, onConnected, onError);
  //     }
  //   } catch (error) {
  //     console.error("Error connecting to WebSocket server:", error);
  //   }
  // };

  // const onConnected = () => {
  //   stompClient?.subscribe("/chatroom/public", onMessageReceived);
  //   stompClient?.subscribe(
  //     "/user/" + userContextData.username + "/private",
  //     onPrivateMessage
  //   );
  //   userJoin();
  // };

  // const userJoin = () => {
  //   let chatMessage = {
  //     senderName: userContextData.username,
  //     message: `...${userContextData.username} join`,
  //     date: new Date(),
  //     receiverName: "",
  //     status: EnumStatus[EnumStatus.JOIN],
  //   };

  //   // stompClient?.send("/app/chat.message", {}, JSON.stringify(chatMessage));
  //   stompClient?.send("/chatroom/public", {}, JSON.stringify(chatMessage));
  //   stompClient?.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));
  // };

  // const userLeave = (username: string) => {
  //   let chatMessage = {
  //     senderName: userContextData.username,
  //     message: `...${userContextData.username} left`,
  //     date: new Date(),
  //     receiverName: "",
  //     status: EnumStatus[EnumStatus.LEAVE],
  //   };
  //   // stompClient?.send("/app/chat.message", {}, JSON.stringify(chatMessage));
  //   // stompClient?.send("/chatroom/public", {}, JSON.stringify(chatMessage));
  //   stompClient?.send("/app/chat.addUser", {}, JSON.stringify(chatMessage));
  // };

  // const [cookie, setCookie] = useState<string | null>(null);
  // const fetchCookie = async () => {
  //   try {
  //     const result = await getCookie("access_token");
  //     setCookie(result?.value ?? null);
  //   } catch (error) {
  //     return null;
  //   }
  // };

  // const onMessageReceived = (payload: any) => {
  //   let payloadData = JSON.parse(payload.body);

  //   switch (payloadData.status) {
  //     case EnumStatus[EnumStatus.JOIN]:
  //       payloadData?.connctedUsers.map((entry: string) => {
  //         if (!privateChats[`${entry}`]) {
  //           setPrivateChats((prev) => {
  //             return { ...prev, [`${entry}`]: [] };
  //           });
  //         }
  //       });
  //       break;
  //     case EnumStatus[EnumStatus.LEAVE]:
  //       const leftUser = payloadData.senderName;
  //       setPrivateChats((prev) => {
  //         const { [`${leftUser}`]: deletedProperty, ...rest } = prev; // Use object destructuring to remove the property
  //         return rest;
  //       });
  //       break;
  //     case EnumStatus[EnumStatus.MESSAGE]:
  //       if (!payloadData) return;
  //       const chatRoom = payloadData.senderName;
  //       if (
  //         privateChats[`${chatRoom}`] &&
  //         userContextData.username !== privateChats[`${chatRoom}`]
  //       ) {
  //         setPrivateChats((prev) => {
  //           return {
  //             ...prev,
  //             [`${chatRoom}`]: [...prev[`${chatRoom}`], payloadData],
  //           };
  //         });
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const sendStreams = useCallback(() => {
  //   localStream?.getTracks().forEach((track: MediaStreamTrack) => {
  //     console.log("track: ", track);

  //     peer?.peer?.addTrack(track, localStream);
  //   });
  // }, [localStream]);

  // const handleCallUser = useCallback(async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     video: true,
  //   });
  //   const offer = await peer?.getOffer();
  //   const message = { offer: offer, user: userContextData };
  //   sendValue("private.message", JSON.stringify(message));
  //   setLocalStream(stream);
  // }, [messageData.receiverName]);

  // const handleIncommingCall = useCallback(
  //   async (room: string, callChatRooms: any) => {
  //     const matchingRoom = callChatRooms?.find((obj: any) =>
  //       Object.keys(obj).includes(room)
  //     );
  //     if (matchingRoom) {
  //       // setRemoteStream(matchingRoom[0]?.room);
  //       // Now you can work with the 'offer' as needed
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //         video: true,
  //       });
  //       setLocalStream(stream);
  //       const offer = JSON.parse(matchingRoom[`${room}`]);

  //       const ans = await peer.getAnswer(offer.offer);
  //       const message = { offer: ans, user: userContextData };

  //       sendValue("private.message", JSON.stringify(message), room);
  //     }
  //   },
  //   []
  // );

  // const onPrivateMessage = async (payload: any) => {
  //   console.log("newanswer: ", payload);
  //   let payloadData = JSON.parse(payload.body);
  //   if (!payloadData) return;

  //   if (payloadData.message.includes('"type":"offer"')) {
  //     setCallChats((prevSet) => {
  //       if (
  //         prevSet.find((r) => Object.keys(r).includes(payloadData.senderName))
  //       )
  //         return [...prevSet];
  //       const obj = { [`${payloadData.senderName}`]: payloadData.message };
  //       return [...prevSet, obj]; // Return the new set
  //     });
  //   }
  //   if (payloadData.message.includes('"type":"answer"')) {
  //     const obj: any = JSON.parse(payloadData.message);
  //     console.log("obj: ", obj);
  //     sendStreams();
  //     if (peer?.peer?.signalingState !== "have-local-offer") {
  //       // Ensure that the peer connection is in the correct state before setting the remote description.
  //       console.log(
  //         "Peer connection not in the right state for setting remote description"
  //       );
  //       return;
  //     }

  //     try {
  //       const offerDescription = obj.offer;
  //       const ans = await peer.setLocalDescription(offerDescription);
  //       console.log("Remote description set successfully", ans);
  //       sendStreams();
  //     } catch (error) {
  //       console.error("Error setting remote description:", error);
  //     }
  //   }
  //   const chatRoom = payloadData.senderName;
  //   if (privateChats[`${chatRoom}`]) {
  //     setPrivateChats((prev) => {
  //       return {
  //         ...prev,
  //         [`${chatRoom}`]: [
  //           ...prev[`${chatRoom}`],
  //           {
  //             ...payloadData,
  //             message: payloadData.message.includes('"type":"offer"')
  //               ? "call from user " + payloadData.senderName
  //               : payloadData.message,
  //           },
  //         ],
  //       };
  //     });
  //   }
  // };

  // const sendValue = (
  //   messageReceiver: string = "chat.message",
  //   messageValue: string = messageData.message,
  //   messageReceiverName: string = messageData.receiverName
  // ) => {
  //   if (stompClient) {
  //     let chatMessage = {
  //       senderName: userContextData.username,
  //       date: new Date(),
  //       message: messageValue,
  //       receiverName: messageReceiverName,
  //       status: EnumStatus[EnumStatus.MESSAGE],
  //     };
  //     if (
  //       privateChats[`${chatMessage.receiverName}`] &&
  //       chatMessage.receiverName !== chatMessage.senderName
  //     ) {
  //       if (chatMessage.message.includes('"type":"offer"')) {
  //         setCallChats((prevSet) => {
  //           const chatCall = JSON.parse(chatMessage?.message);
  //           const obj = { [`${chatCall.user.username}`]: chatCall.offer };
  //           return [...prevSet, obj]; // Return the new set
  //         });
  //         setPrivateChats((prev) => {
  //           return {
  //             ...prev,
  //             [`${chatMessage.receiverName}`]: [
  //               ...prev[`${chatMessage.receiverName}`],
  //               {
  //                 ...chatMessage,
  //                 message: "call user " + chatMessage.receiverName,
  //               },
  //             ],
  //           };
  //         });
  //       } else if (chatMessage.message.includes('"type":"answer"')) {
  //       } else {
  //         setPrivateChats((prev) => {
  //           return {
  //             ...prev,
  //             [`${chatMessage.receiverName}`]: [
  //               ...prev[`${chatMessage.receiverName}`],
  //               chatMessage,
  //             ],
  //           };
  //         });
  //       }
  //     }
  //     stompClient?.send(
  //       `/app/${messageReceiver}`,
  //       {},
  //       JSON.stringify(chatMessage)
  //     );
  //   }
  // };

  // const handlePushMessage = (item: any) => {
  //   sendValue("private.message");

  //   setMessageData((prev) => {
  //     return { ...prev, message: "" };
  //   });
  // };

  // const onError = (err: any) => {
  //   console.log("err: ", err);
  // };

  // useEffect(() => {
  //   fetchCookie();

  //   if (typeof window !== "undefined") {
  //     connect();
  //   }
  // }, [cookie]);