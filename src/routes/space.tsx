"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import CreateFormButton from "../components/Form/CreatRoomButton";
import ChatForm from "../components/Form/ChatForm";
import CreateRoom from "../components/Form/CreateRoom";
import LoginForm from "../components/LogInForm";
import Link from "next/link";
import { AuthContext } from "../providers/AuthProvider";
import { IMessage } from "../interfaces/chat";
import peer from "@/src/utils/peer";
import VideoComponent from "../components/VideoComponent";
import CallIcon from "@mui/icons-material/Call";
import { WebSocketContext } from "../providers/WebSocketProvider";

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
  ],
};

export const SpaceComponent = () => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const websocketRef = useRef();

  const { userContextData, _ }: any = useContext(AuthContext);
  const {
    callChats,
    setCallChats,
    privateChats,
    messageData,
    setMessageData,
    handlePushMessage,
    cookie,
    sendValue,
  }: any = useContext(WebSocketContext);

  const pc = useRef(new RTCPeerConnection(servers));
  const callInput = useRef(null);
  // useEffect(() => {
  //   if (Object.keys(privateChats).length < 1) return;
  //   if (
  //     privateChats[
  //       `${Object.keys(privateChats)[Object.keys(privateChats).length - 1]}`
  //     ].length < 1
  //   ) {
  //     return;
  //   }
  //   pc.current.addEventListener("track", async (ev) => {
  //     const newRemoteStream = ev.streams;
  //     console.log("GOT TRACKS!!", newRemoteStream);
  //     setRemoteStream(newRemoteStream[0]);
  //   });

  // }, [privateChats]);
  useEffect(() => {
    console.log("privateChats: ", privateChats);
    pc.current.addEventListener("track", async (ev) => {
      const newRemoteStream = ev.streams;
      console.log("GOT TRACKS!!", newRemoteStream);
      setRemoteStream(newRemoteStream[0]);
    });
  }, []);
  console.log("remoteStream: ", remoteStream);
  console.log("localStream: ", localStream);
  console.log("privateChats: ", privateChats);
  console.log("callChats: ", callChats);

  const webcamButtonOnClick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    console.log("stream: ", stream);

    setLocalStream(stream);
    try {
      // Push tracks from local stream to peer connection
      stream.getTracks().forEach((track) => {
        console.log("getTracks: ", track);
        pc.current.addTrack(track, stream);
      });

      // Pull tracks from remote stream, add to video stream
      // pc.current.ontrack = (event) => {
      //   const newRemoteStream = new MediaStream();
      //   event.streams[0].getTracks().forEach((track) => {
      //     newRemoteStream.addTrack(track);
      //   });
      // setRemoteStream(newRemoteStream);
      // };
      // Pull tracks from remote stream, add to video stream
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const callButtonOnClick = async () => {
    // Get candidates for caller, save to WebSocket
    pc.current.onicecandidate = (event) => {
      event.candidate &&
        sendValue("private.message", JSON.stringify(event.candidate.toJSON()));
    };

    // Create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    // Send the offer via WebSocket
    const message = { offer: offer, user: userContextData };
    sendValue("private.message", JSON.stringify(message));
  };


  const answerButtonOnClick = async (room: string, rooms: any) => {
    try {
      // Parse the offer received via WebSocket
      const receivedOffer = rooms.find((r: any) =>
        Object.keys(r).includes(room)
      );

      pc.current.onicecandidate = (event) => {
        event.candidate &&
          sendValue("private.message", JSON.stringify(event.candidate.toJSON()));
      };

      const remoteOffer = new RTCSessionDescription(
        JSON.parse(receivedOffer[`${room}`].offer).offer
      );

      console.log("receivedOffer: ", JSON.parse(receivedOffer[`${room}`].offer).offer);
      console.log("remoteOffer: ", remoteOffer);
      // Set the remote offer as the remote description
      await pc.current.setRemoteDescription(remoteOffer);

      // Set up the ontrack event handler for remote tracks
      pc.current.ontrack = (event) => {
        const newRemoteStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          newRemoteStream.addTrack(track);
          console.log("newRemoteStream: ", newRemoteStream);
        });
        setRemoteStream(newRemoteStream);
      };

      pc.current.ontrack = (event) => {
        const newRemoteStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          newRemoteStream.addTrack(track);
          console.log("newRemoteStream: ", newRemoteStream);
        });
        setRemoteStream(newRemoteStream);
      };

      // Create an answer
      const answerDescription = await pc.current.createAnswer();

      // Set the answer as the local description
      await pc.current.setLocalDescription(answerDescription);

      // Send the answer back to the remote peer via WebSocket
      const answerMessage = {
        answer: {
          sdp: answerDescription.sdp,
          type: answerDescription.type,
        },
        user: userContextData,
      };
      const obj = JSON.parse(receivedOffer[`${room}`].offer);
      console.log("answerMessage: ", receivedOffer);
      console.log("rooms: ", rooms);
      
      receivedOffer[`${room}`].candidates.map((change:any) => {
          console.log("change: ",JSON.parse(change));
          // console.log("candidate: ",JSON.parse(JSON.parse(change).candidate));
          // if (change.type === 'added') {
          //   let data = change.doc.data();
            pc.current.addIceCandidate(new RTCIceCandidate(JSON.parse(change).candidate));
          // }
        });

      // Send the answer message over WebSocket
      sendValue("private.message", JSON.stringify(answerMessage), room);
    } catch (error) {
      console.error("Error creating or sending answer:", error);
    }
  };

 
  
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
              {callChats?.some(
                (obj: any, index: number) => Object.keys(obj)[index] === item
              ) ? (
                <CallIcon
                  className="has-call-sidebar"
                  // onClick={() => handleIncommingCall(item, callChats)}
                  onClick={() => answerButtonOnClick(item, callChats)}
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        <div className="chat-container">
          <button id="webcamButton" onClick={() => webcamButtonOnClick()}>
            Start Webcam
          </button>
          <button
            id="callButton"
            onClick={callButtonOnClick}
            disabled={!localStream}>
            Call
          </button>
          <button
            id="answerButton"
            // onClick={() => answerButtonOnClick("item", callChats)}
            disabled={!localStream}>
            Answer
          </button>

          <div className="chat-inbox-container">
            <div className="chat-inbox">
              <div className="videos">
                {/* Add other buttons and video elements here */}
                <span>me</span>
                <video
                  id="webcamVideo"
                  autoPlay
                  muted
                  ref={(localVideoRef) => {
                    if (localVideoRef) localVideoRef.srcObject = localStream;
                  }}></video>
                <span>him</span>
                <video
                  id="remoteVideo"
                  autoPlay
                  ref={(remoteVideoRef) => {
                    if (remoteVideoRef) remoteVideoRef.srcObject = remoteStream;
                  }}></video>
                {/* <VideoComponent
                  stream={localStream}
                  title={userContextData.username}
                />
                <VideoComponent stream={remoteStream} title={"Remote Stream"} /> */}
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
            videoStream={{
              localStream,
              setLocalStream,
              remoteStream,
              setRemoteStream,
              callButtonOnClick,
              // handleCallUser,
            }}
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
