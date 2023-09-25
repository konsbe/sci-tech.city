"use client"
import React, { createContext, useState } from "react";

// Create a context for the modal
const ModalContext = createContext<any>(null);

/* Create a ModalProvider component
 * Provider is a component technich in React to pass through parent components
 * funtionality without prop drilling
 */
const ModalProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Value to be provided by the context
  const modalValue = {
    isOpen,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
