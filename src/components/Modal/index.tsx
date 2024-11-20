import React, { useContext, useEffect } from "react";
import "./styles.css";
import { ModalContext } from "@/src/providers/ModalProvider";

const Modal = ({ children }: any) => {
  const { isOpen, closeModal } = useContext(ModalContext);

  useEffect(() => {
    // Function to handle the Escape key press
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    // Only add the event listener if the modal is open
    if (isOpen) {
      window.addEventListener("keydown", handleEscapeKey);
    }

    // Clean up the event listener when the modal is closed or when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, closeModal]); // Re-run when modal state changes

  return isOpen ? (
    <>
      <div
        className={"modal-transparent-background"}
        onClick={closeModal}></div>
      <div className="modal-container">
        <div className="modal-content">{children}</div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Modal;
