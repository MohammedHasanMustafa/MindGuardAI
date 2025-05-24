import { useState } from "react";

const VideoSequence = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos = [
    "/home2.mp4", 
    "/home2.mp4",
    "/home2.mp4",
  ];

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <div className="mt-10 ml-60 p-3 flex items-center justify-center relative">
      <div className="relative w-[700px] h-[400px] max-w-full flex items-center justify-center rounded-2xl overflow-hidden border-4 border-gradient-to-r from-blue-400 via-purple-500 to-pink-400 shadow-2xl">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          src={videos[currentVideoIndex]}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd} />
        <div className="absolute inset-0 rounded-2xl border-4 border-white opacity-20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default VideoSequence;
