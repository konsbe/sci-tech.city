"use client";
import { ModalContext } from "@/src/providers/ModalProvider";
import { Button } from "@mui/material";
import React, { useContext } from "react";

function CreateFormButton() {
  const { openModal } = useContext(ModalContext);

  return (
    <Button
      fullWidth={true}
      color="primary"
      className="create-room"
      onClick={openModal}>
      Create Chat
    </Button>
  );
}

export default CreateFormButton;
