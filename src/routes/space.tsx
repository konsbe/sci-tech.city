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
import { EnumStatus, IMessage } from "../interfaces/chat";
import CallIcon from "@mui/icons-material/Call";
import { WebSocketContext } from "../providers/WebSocketProvider";
import VideoComponent from "../components/VideoComponent";
import { WebRTCContext } from "../providers/WebRTCProvider";

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
  // const [isFullScreen, setIsFullScreen] = useState(false);
  // const [isMicEnabled, setIsMicEnabled] = useState(true);
  // const [isScreenSharing, setIsScreenSharing] = useState(false);
  // const [isMyCameraEnabled, setIsMyCameraEnabled] = useState(false);

  // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // const [shareScreenStream, setShareScreenStream] = useState<MediaStream | null>(null);
  // const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const { userContextData, _ }: any = useContext(AuthContext);
  const {
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
    callAccepted,
    setCallAccepted,
  }: any = useContext(WebSocketContext);
  const {
    remoteStream,
    localStream,
    webcamButtonOnClick,
    callButtonOnClick,
    answerButtonOnClick,
    rejectButtonOnClick,
    isMyCameraEnabled, toggleMicrophone, isMicEnabled, shareScreenButtonOnClick, isScreenSharing, closeCallOnClick, shareScreenStream

  }: any = useContext(WebRTCContext);

  // const pc = useRef(new RTCPeerConnection(servers));
  // const callInput = useRef(null);

  // const toggleFullScreen = () => {
  //   if (document.documentElement.requestFullscreen) {
  //     if (isFullScreen) {
  //       document.exitFullscreen();
  //     } else {
  //       document.documentElement.requestFullscreen();
  //     }
  //     setIsFullScreen(!isFullScreen);
  //   }
  // };

  // useEffect(() => {
  //   if (callData.receiverName === userContextData.username) return;
  //   if (!privateChats[`${callData.receiverName}`]?.length) return;
    
  //   handleReceiverAnswer(
  //     privateChats[`${callData.receiverName}`][
  //       privateChats[`${callData.receiverName}`]?.length - 1
  //     ]?.message
  //   );
  // }, [callAccepted]);

  // useEffect(() => {
  //   console.log("privateChats:: ", privateChats);
  //   Object.values(privateChats).map((chatItem: any, index) => {
  //     if(chatItem?.length){ 
  //     chatItem.map((item:any) => {
  //       if (item.status === "LEAVE") closeCallOnClick(messageData.receiverName, [])
  //     }) 
  //   }
  //   })
    
  // }, [privateChats]);

  // useEffect(() => {
  //   pc.current.addEventListener("track", async (ev) => {
  //     const newRemoteStream = ev.streams;

  //     setRemoteStream(newRemoteStream[0]);
  //   });
  // }, []);

  // useEffect(() => {
  //   // Pull tracks from remote stream, add to video stream
  //   pc.current.ontrack = (event) => {
  //     const newRemoteStream = new MediaStream();
  //     event.streams[0].getTracks().forEach((track) => {
  //       newRemoteStream.addTrack(track);
  //     });
  //     setRemoteStream(newRemoteStream);
  //   };
  // }, []);

  // const toggleMicrophone = async () => {
  //   if (localStream) {
  //     // Get all tracks in the stream
  //     const tracks = localStream.getTracks();

  //     // Loop through tracks and enable/disable them as needed
  //     tracks.forEach((track) => {
  //       if (track.kind === "audio") {
  //         track.enabled = !isMicEnabled; // Enable/disable the audio track
  //       }
  //     });

  //     setIsMicEnabled(!isMicEnabled);
  //   }
  // };

  // const webcamButtonOnClick = async (vb: boolean, ab: boolean) => {
  //   if (localStream) {
  //     // Get all tracks in the stream
  //     const tracks = localStream.getTracks();

  //     // Loop through tracks and enable/disable them as needed
  //     tracks.forEach((track) => {
  //       if (track.kind === "video") {
  //         track.enabled = !isMyCameraEnabled; // Enable/disable the video track
  //       } else if (track.kind === "audio") {
  //         track.enabled = ab; // Enable/disable the audio track
  //       }
  //     });

  //     // No need to trigger renegotiation here
  //   } else {
  //     // If localStream is not yet created, create it
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: vb,
  //       audio: ab,
  //     });

  //     setLocalStream(stream);

  //     // Add tracks to the peer connection
  //     stream.getTracks().forEach((track) => {
  //       pc.current.addTrack(track, stream);
  //     });

  //     // No need to trigger renegotiation here
  //   }

  //   setIsMyCameraEnabled(!isMyCameraEnabled);
  // };

  // const webcamButtonOnClick = async (vb: boolean, ab: boolean) => {
    
  //   if (isScreenSharing) {
  //     // Toggle the camera
  //     if (localStream) {
  //       const cameraTracks = localStream.getVideoTracks();
  //       cameraTracks.forEach((track) => {
  //         track.enabled = !isMyCameraEnabled;
  //       });
  //     }
  //     setIsMyCameraEnabled(!isMyCameraEnabled);

  //     // No need to trigger renegotiation here
  //   } else {
  //     if (localStream) {
  //       // Toggle the camera
  //       const cameraTracks = localStream.getVideoTracks();
  //       cameraTracks.forEach((track) => {
  //         track.enabled = !isMyCameraEnabled;
  //       });
  //       setIsMyCameraEnabled(!isMyCameraEnabled);

  //       // No need to trigger renegotiation here
  //     } else {
  //       // If localStream is not yet created, create it
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: vb,
  //         audio: ab,
  //       });

  //       setLocalStream(stream);

  //       // Add tracks to the peer connection
  //       stream.getTracks().forEach((track) => {
  //         pc.current.addTrack(track, stream);
  //       });

  //       setIsMyCameraEnabled(!isMyCameraEnabled);

  //       // No need to trigger renegotiation here
  //     }

  //   }
  // };



  // const shareScreenButtonOnClick = async () => {
  //   if (isScreenSharing) {
  //     // Stop screen sharing
  
  //     shareScreenStream?.getTracks().forEach((track) => {
  //       track.stop(); // Stop the screen sharing track
  //     });
  
  //     // Remove screen sharing tracks from the localStream
  //     const screenTracks = localStream?.getVideoTracks().filter((track) => track.kind === "video");
  //     screenTracks?.forEach((track) => {
  //       localStream?.removeTrack(track);
  //     });
  
  //     setIsScreenSharing(false);
  //   } else {
  //     // Start screen sharing
  //     const screenStream = await navigator.mediaDevices.getDisplayMedia();
  //     // Add screen sharing tracks to the localStream
  //     screenStream.getTracks().forEach((track) => {
  //       shareScreenStream?.addTrack(track);
  //       localStream?.addTrack(track); // Add screen sharing tracks to the localStream
  //     });
  
  //     setShareScreenStream(screenStream);
  
  //     setIsScreenSharing(true);
  //   }
  // };
  

  // const callButtonOnClick = async () => {
  //   // Get candidates for caller, save to WebSocket
    
  //   if (!localStream){
  //     setIsMyCameraEnabled(true)
  //     await webcamButtonOnClick(true, true);
  //   }
  //   pc.current.onicecandidate = (event) => {
  //     // Assuming obj is your RTCIceCandidate object
  //     var obj = event.candidate && {
  //       address: event.candidate.address,
  //       candidate: event.candidate.candidate,
  //       component: event.candidate.component,
  //       foundation: event.candidate.foundation,
  //       port: event.candidate.port,
  //       priority: event.candidate.priority,
  //       protocol: event.candidate.protocol,
  //       relatedAddress: event.candidate.relatedAddress,
  //       relatedPort: event.candidate.relatedPort,
  //       sdpMLineIndex: event.candidate.sdpMLineIndex,
  //       sdpMid: event.candidate.sdpMid,
  //       tcpType: event.candidate.tcpType,
  //       type: event.candidate.type,
  //       usernameFragment: event.candidate.usernameFragment,
  //     };

  //     var jsonString = JSON.stringify(obj);

  //     obj &&
  //       setCallChats(
  //         (prevSet: { [x: string]: { offer: any; candidates: any } }[]) => {
  //           const arr = prevSet.map(
  //             (r: {
  //               [x: string]: {
  //                 offer: any;
  //                 candidates: any;
  //               };
  //             }) => {
  //               return Object.keys(r).includes(messageData.receiverName)
  //                 ? {
  //                     [`${messageData.receiverName}`]: {
  //                       offer: r[`${messageData.receiverName}`].offer,
  //                       candidates: [
  //                         ...r[`${messageData.receiverName}`].candidates,
  //                         obj,
  //                       ],
  //                     },
  //                   }
  //                 : r;
  //             }
  //           );
  //           return arr;
  //         }
  //       );

  //     obj &&
  //       sendValue(
  //         "private.message",
  //         jsonString,
  //         messageData.receiverName,
  //         EnumStatus[EnumStatus.CANDIDATE]
  //       );
  //   };
  //   setCallData((prev: any) => {
  //     return {
  //       ...prev,
  //       callerName: userContextData.username,
  //       receiverName: messageData.receiverName,
  //     };
  //   });

  //   // Create offer
  //   const offerDescription = await pc.current.createOffer();
  //   await pc.current.setLocalDescription(offerDescription);

  //   const offer: Partial<RTCSessionDescription> = {
  //     sdp: offerDescription.sdp,
  //     type: offerDescription.type,
  //   };

  //   // Send the offer via WebSocket
  //   const message = { offer: offer, user: userContextData };

  //   setCallChats((prevSet: any) => {
  //     const obj = {
  //       [`${messageData.receiverName}`]: {
  //         offer: offer,
  //         candidates: [],
  //       },
  //     };
  //     return [...prevSet, obj];
  //   });

  //   sendValue(
  //     "private.message",
  //     JSON.stringify(message),
  //     messageData.receiverName,
  //     EnumStatus[EnumStatus.CALLOFFER]
  //   );
  // };

  // const answerButtonOnClick = async (room: string, rooms: any) => {
  //   try {
  //     // Parse the offer received via WebSocket
  //     if (!localStream){
  //       setIsMyCameraEnabled(true)
  //       await webcamButtonOnClick(true, true);
  //     }
  
  //     const receivedOffer = rooms.find((r: any) =>
  //       Object.keys(r).includes(room)
  //     );

  //     pc.current.onicecandidate = (event) => {
  //       var obj = event.candidate && {
  //         address: event.candidate.address,
  //         candidate: event.candidate.candidate,
  //         component: event.candidate.component,
  //         foundation: event.candidate.foundation,
  //         port: event.candidate.port,
  //         priority: event.candidate.priority,
  //         protocol: event.candidate.protocol,
  //         relatedAddress: event.candidate.relatedAddress,
  //         relatedPort: event.candidate.relatedPort,
  //         sdpMLineIndex: event.candidate.sdpMLineIndex,
  //         sdpMid: event.candidate.sdpMid,
  //         tcpType: event.candidate.tcpType,
  //         type: event.candidate.type,
  //         usernameFragment: event.candidate.usernameFragment,
  //       };

  //       event.candidate &&
  //         sendValue(
  //           "private.message",
  //           JSON.stringify(obj),
  //           messageData.receiverName,
  //           EnumStatus[EnumStatus.CANDIDATE]
  //         );
  //     };

  //     // Set up the ontrack event handler for remote tracks
  //     pc.current.ontrack = (event) => {
  //       const newRemoteStream = new MediaStream();
  //       event.streams[0].getTracks().forEach((track) => {
  //         newRemoteStream.addTrack(track);
  //       });
  //       setRemoteStream(newRemoteStream);
  //     };

  //     const remoteOffer = new RTCSessionDescription(
  //       JSON.parse(receivedOffer[`${room}`].offer).offer
  //     );

  //     // Set the remote offer as the remote description
  //     await pc.current.setRemoteDescription(remoteOffer);

  //     // adds the ICE candidates received from the caller using
  //     receivedOffer[`${room}`].candidates.map((change: any) => {
  //       const iceCandidate = new RTCIceCandidate(JSON.parse(change));
  //       pc.current.addIceCandidate(iceCandidate);
  //     });

  //     // Create an answer
  //     const answerDescription = await pc.current.createAnswer();

  //     // Set the answer as the local description
  //     await pc.current.setLocalDescription(answerDescription);

  //     // Send the answer back to the remote peer via WebSocket
  //     const answerMessage = {
  //       answer: {
  //         sdp: answerDescription.sdp,
  //         type: answerDescription.type,
  //       },
  //       user: userContextData,
  //     };

  //     // Send the answer message over WebSocket
  //     sendValue(
  //       "private.message",
  //       JSON.stringify(answerMessage),
  //       room,
  //       EnumStatus[EnumStatus.CALLACCEPTED]
  //     );
  //   } catch (error) {
  //     console.error("Error creating or sending answer:", error);
  //   }
  // };

  // const handleReceiverAnswer = async (answerMessage: any) => {
  //   try {
  //     // Parse the answer message
  //     const { answer, user }: { answer: RTCSessionDescription; user: any } =
  //       JSON.parse(answerMessage);
  //     // Set the remote description with the received answer
  //     if (pc.current.signalingState !== "have-remote-offer") {
  //       const answerDescription = new RTCSessionDescription(answer);
  //       await pc.current.setRemoteDescription(answerDescription);
  //     } else {
  //       // Handle the case where setting the remote description is not allowed in the current state.
  //       console.warn(
  //         "Cannot set remote description in the current state:",
  //         pc.current.signalingState
  //       );
  //     }
  //     // Handle ICE candidates from the receiver (if any)
  //     // if (user && user.userId === messageData.receiverName) {
  //     // Extract and handle ICE candidates
  //     // console.log("callChats: ", callChats);
  //     const receivedOffer = callChats.find((r: any) =>
  //       Object.keys(r).includes(user.username)
  //     );

  //     const iceCandidates =
  //       receivedOffer[`${messageData.receiverName}`].candidates;

  //     iceCandidates.forEach((candidate: any) => {
  //       const iceCandidate = new RTCIceCandidate(candidate);
  //       pc.current.addIceCandidate(iceCandidate);
  //     });
  //   } catch (error) {
  //     console.error("Error handling receiver answer:", error);
  //   }
  // };

  // const closeCallOnClick = async (room: string, rooms: any) => {
  //   console.log("room:: ",room);
  //       try {

  //   const answerMessage = {
  //     answer: {
  //       user: userContextData.username,
  //       type: "END-CALL",
  //     },
  //     user: userContextData,
  //   };
  //   console.log("answerMessage: ", answerMessage);
    
  //   sendValue(
  //     "private.message",
  //     JSON.stringify(answerMessage),
  //     room,
  //     EnumStatus[EnumStatus.LEAVE]
  //   );

  //   // if (pc.current) {
  //   //   pc.current.close();
  //   //   if (localStream) {
  //   //     localStream.getTracks().forEach(track => track.stop());
  //   //   }
  //   //   if (remoteStream) {
  //   //     remoteStream.getTracks().forEach(track => track.stop());
  //   //   }
      
  //   //   setLocalStream(null);
  //   //   setRemoteStream(null);
  //   //   // Send the answer message over WebSocket
  //   // }
  //   } catch (error) {
  //     console.error("Error handling receiver answer:", error);
  //   }
  // }
  // const rejectButtonOnClick = async (room: string, rooms: any) => {

  //   if (callData.callerName) {
  //     try {
  //       // Create a rejection answer with an empty SDP
  //       const rejectionDescription: RTCSessionDescriptionInit = {
  //         sdp: "v=",
  //         type: "answer",
  //       };

  //       // Set the rejection answer as the local description
  //       await pc.current.setLocalDescription(
  //         new RTCSessionDescription(rejectionDescription)
  //       );

  //       // Send the rejection answer back to the caller via WebSocket
  //       const rejectionMessage = {
  //         answer: rejectionDescription,
  //         user: userContextData,
  //       };

  //       sendValue(
  //         "private.message",
  //         JSON.stringify(rejectionMessage),
  //         callData.callerName,
  //         EnumStatus[EnumStatus.CALLREJECTED]
  //       );
  //       setCallChats((prev: any) => {
  //         return prev.forEach((obj: Object) => {
  //           !Object.keys(obj).includes(room);
  //         });
  //       });

  //       // Reset the call data
  //       setCallData((prev: any) => ({
  //         ...prev,
  //         callerName: null,
  //         receiverName: null,
  //       }));

  //       // Close the peer connection
  //       pc.current.close();
  //       setLocalStream(null);
  //       setRemoteStream(null);
  //     } catch (error) {
  //       console.error("Error rejecting call offer:", error);
  //     }
  //   }
  // };


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
                      onClick={() =>
                        closeCallOnClick(messageData.receiverName, callChats)
                        // rejectButtonOnClick(messageData.receiverName, callChats)
                      }
                      disabled={!localStream}>
                      Close Call
                    </button>
                  )}
                </div>
              </div>

              <div className="videos">
                <VideoComponent
                  stream={isScreenSharing || shareScreenStream ? shareScreenStream : localStream}
                  title={userContextData.username}
                />
                <VideoComponent
                  stream={remoteStream}
                  title={messageData.receiverName}
                />
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
