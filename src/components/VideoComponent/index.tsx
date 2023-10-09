"use client"
import { useEffect, useRef } from "react";

// type MediaStreamType = MediaStream & MediaStreamTrack & null ; 

const VideoComponent = ({
  stream,
  title,
}: {
  stream: MediaStream | null;
  title: string;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
        try {
          videoRef.current.srcObject = stream;
        } catch (error) {
          console.error('Error setting srcObject:', error);
        }
      }
  }, [stream,videoRef]);

  return (
    <span>
      <h3>{title}</h3>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={title === "Local Stream"}
      />
    </span>
  );
};

export default VideoComponent;
