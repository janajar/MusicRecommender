import React, { useState } from 'react';
import Header from './Header.js';
import Confetti from './Confetti';
import Uploader from './Uploader';
import './App.css';

function App() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(false);

  const handleUploadComplete = (videoURL) => {
    setVideoSrc(videoURL);
    setVideoUploaded(true);
  };

  return (
    <div>
      <Header />
      <Confetti />
      <div className="background">
        <Uploader onUploadComplete={handleUploadComplete} videoUploaded={videoUploaded} videoSrc={videoSrc} />
      </div>
    </div>
  );
}

export default App;
