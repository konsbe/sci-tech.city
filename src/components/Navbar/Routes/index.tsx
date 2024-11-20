"use client";
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useContext,
  useEffect,
} from "react";
import "./routes.css";
import { pages } from "../options";
import Link from "next/link";
import { ModalContext } from "@/src/providers/ModalProvider";

export const RoutingNavLayout = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [location, setLocation] = useState("");
  const ref = useRef<any>(null);
  const { closeModal } = useContext(ModalContext);

  useEffect(() => {
    if (typeof window !== "undefined") setLocation(window.location.pathname);
  }, []);

  useLayoutEffect(() => {
    const { top } = ref.current.getBoundingClientRect();

    const handleScroll = () => {
      setIsSticky(window.scrollY > 65);
    };
    console.log(window.scrollY);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`routing-navbar ${isSticky ? "sticky" : ""}`}
      ref={ref}
      onClick={closeModal}>
      {pages.map((page, index) => {
        return (
          <Link
            onClick={() => setLocation(page.path)}
            className={`route-element ${
              location === "/" && page.path === "/"
                ? "active-route-element"
                : location.includes(page.path) && page.path !== "/"
                ? "active-route-element"
                : ""
            }`}
            key={index}
            href={page.path}>
            {page.title}
          </Link>
        );
      })}
    </div>
  );
};

export default RoutingNavLayout;
