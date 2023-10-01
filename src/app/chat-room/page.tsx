import React from "react";
import "./chatRoom.css";
import ChatForm from "@/src/components/Form/ChatForm";
import ButtonForm from "@/src/components/Form/ButtonForm";
import { Button } from "@mui/material";
import Modal from "@/src/components/Modal";
import CreateRoom from "@/src/components/Form/CreateRoom";
import CreateFormButton from "@/src/components/Form/CreatRoomButton";
import SpaceComponent from "@/src/routes/space";


let fuck = "fuck";

function ChatRoom() {
  fuck += " chatRoom";
  return (
    <div className="body-container">
      <SpaceComponent />
    </div>
  );
}

export default ChatRoom;
