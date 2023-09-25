import React, { useContext } from "react";
import "./styles.css";
import { ModalContext } from "@/src/providers/ModalProvider";

const Modal = ({ children }: any) => {
  const { isOpen, closeModal } = useContext(ModalContext);

  return isOpen ? (
    <>
      <div className="modal-transparent-background" onClick={closeModal}></div>
      <div className="modal-container">
        <div className="modal-content">{children}</div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Modal;
