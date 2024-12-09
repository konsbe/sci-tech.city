"use client";
import React, { useState } from "react";
import Modal from "../../Modal";
import InputForm from "../InputForm";
import ButtonForm from "../ButtonForm";
import { FormControlLabel, Switch } from "@mui/material";

function CreateRoom() {
  const [room, setRoom] = useState<string>("");
  const [publicChat, setPublicChat] = useState<boolean>(true);
  const handleClick = () => {
  };

  return (
    <Modal>
      <div className="create-room-modal">
        <InputForm
          label="room"
          type="room"
          name="room"
          value={room}
          variant="standard"
          color="secondary"
          sx={{ width: 200, input: { color: "black" } }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRoom(e.target.value)
          }
        />
        <FormControlLabel
          value="publicChat"
          control={
            <Switch
              checked={publicChat}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPublicChat(e.target.checked);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Public"
          labelPlacement="start"
        />
        <div>
          <ButtonForm
            className="create-room"
            // startIcon={<LockOpenIcon />}
            variant="outlined"
            color="success"
            type="submit"
            onClick={() => handleClick()}
            sx={{ width: 200 }}>
            Create Room
          </ButtonForm>
        </div>
      </div>
    </Modal>
  );
}

export default CreateRoom;
