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
  const { userContextData, _ }: any = useContext(AuthContext);
  const {
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
  }: any = useContext(WebSocketContext);

  const pc = useRef(new RTCPeerConnection(servers));
  const callInput = useRef(null);

  useEffect(() => {
    
    if (!callData.callerName || !callData.receiverName) return;
    if (Object.keys(privateChats).length < 1) return;
    if (
      privateChats[callData.receiverName]?.length < 1
    ) {
      return;
    }
    if (
      !privateChats[`${callData.receiverName}`][
        privateChats[`${callData.receiverName}`]?.length - 1
      ]?.message?.includes("answer")
    ) {
      return;
    }
    if (
      privateChats[`${callData.callerName}`][
        privateChats[`${callData.callerName}`]?.length - 1
      ]?.message?.includes("answer") &&
      callData.receiverName === userContextData.username
    ) {
      return;
    }
    handleReceiverAnswer(
      privateChats[`${callData.receiverName}`][
        privateChats[`${callData.receiverName}`]?.length - 1
      ]?.message
    );
  }, [privateChats]);

  useEffect(() => {
    pc.current.addEventListener("track", async (ev) => {
      const newRemoteStream = ev.streams;
      setRemoteStream(newRemoteStream[0]);
    });
  }, []);

  useEffect(() => {
    // Pull tracks from remote stream, add to video stream
    pc.current.ontrack = (event) => {
      const newRemoteStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        newRemoteStream.addTrack(track);
      });
      setRemoteStream(newRemoteStream);
    };
  }, []);

  const handleReceiverAnswer = async (answerMessage: any) => {
    try {

      // Parse the answer message
      const { answer, user } = JSON.parse(answerMessage);

      // Set the remote description with the received answer
      if (pc.current.signalingState !== "have-remote-offer") {
        const answerDescription = new RTCSessionDescription(answer);
        await pc.current.setRemoteDescription(answerDescription);
      } else {
        // Handle the case where setting the remote description is not allowed in the current state.
        console.warn(
          "Cannot set remote description in the current state:",
          pc.current.signalingState
        );
      }
      // Handle ICE candidates from the receiver (if any)
      // if (user && user.userId === messageData.recei) {
      // Extract and handle ICE candidates
      const iceCandidates = user.candidates || [];
      iceCandidates.forEach((candidate: any) => {
        const iceCandidate = new RTCIceCandidate(candidate);
        pc.current.addIceCandidate(iceCandidate);
      });
      // }
    } catch (error) {
      console.error("Error handling receiver answer:", error);
    }
  };

  const webcamButtonOnClick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    try {
      // Push tracks from local stream to peer connection
      stream.getTracks().forEach((track) => {
        pc.current.addTrack(track, stream);
      });

      // Pull tracks from remote stream, add to video stream
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const callButtonOnClick = async () => {
    // Get candidates for caller, save to WebSocket
    pc.current.onicecandidate = (event) => {
      // Assuming obj is your RTCIceCandidate object
      var obj = event.candidate && {
        address: event.candidate.address,
        candidate: event.candidate.candidate,
        component: event.candidate.component,
        foundation: event.candidate.foundation,
        port: event.candidate.port,
        priority: event.candidate.priority,
        protocol: event.candidate.protocol,
        relatedAddress: event.candidate.relatedAddress,
        relatedPort: event.candidate.relatedPort,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid,
        tcpType: event.candidate.tcpType,
        type: event.candidate.type,
        usernameFragment: event.candidate.usernameFragment,
      };

      var jsonString = JSON.stringify(obj);

      obj && sendValue("private.message", jsonString);
    };
    setCallData((prev: any) => {
      return {
        ...prev,
        callerName: userContextData.username,
        receiverName: messageData.receiverName,
      };
    });

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
        var obj = event.candidate && {
          address: event.candidate.address,
          candidate: event.candidate.candidate,
          component: event.candidate.component,
          foundation: event.candidate.foundation,
          port: event.candidate.port,
          priority: event.candidate.priority,
          protocol: event.candidate.protocol,
          relatedAddress: event.candidate.relatedAddress,
          relatedPort: event.candidate.relatedPort,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          tcpType: event.candidate.tcpType,
          type: event.candidate.type,
          usernameFragment: event.candidate.usernameFragment,
        };

        event.candidate && sendValue("private.message", JSON.stringify(obj));
      };

      // Set up the ontrack event handler for remote tracks
      pc.current.ontrack = (event) => {
        const newRemoteStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          newRemoteStream.addTrack(track);
        });
        setRemoteStream(newRemoteStream);
      };

      const remoteOffer = new RTCSessionDescription(
        JSON.parse(receivedOffer[`${room}`].offer).offer
      );

      // Set the remote offer as the remote description
      await pc.current.setRemoteDescription(remoteOffer);

      // adds the ICE candidates received from the caller using
      receivedOffer[`${room}`].candidates.map((change: any) => {
        pc.current.addIceCandidate(new RTCIceCandidate(JSON.parse(change)));
      });

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
