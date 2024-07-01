import React, { useState } from 'react';
import Header from './Header.js';
import vidButton from './img/vid-button.svg';
import Confetti from './Confetti';
import './App.css';

function App() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setLoading(true);

    const files = e.dataTransfer.files;
    const videoFile = files[0];
    const videoURL = URL.createObjectURL(videoFile);

    setTimeout(() => {
      setVideoSrc(videoURL);
      setLoading(false);
    }, 2000); // Simulating loading delay

  };

  return (
    <div>
      <Header />
      <Confetti />
      <div className="background">
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <img 
            src= {vidButton} 
            alt="Upload Button" 
            style={{ height: '400px', width: '230px' }} 
            className={dragging ? 'button-shift' : ''}
          />
          {loading ? (
            <p>Loading...</p>
          ) : videoSrc ? (
            <video controls width="280" height="400" src={videoSrc}></video>
          ) : (
            <p>Drag video here</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
