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
    <div className="video-comp">
      <span>{title}</span>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={350}
        height={280}
        className="video-ref"
        muted={title === "Local Stream"}
      />
    </div>
  );
};

export default VideoComponent;
