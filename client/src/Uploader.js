import React, { useState } from 'react';
import vidButton from './img/vid-button.svg'; // Adjusted file extension
import './App.css';

const Uploader = ({ onUploadComplete, videoUploaded, videoSrc }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

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
      onUploadComplete(videoURL);
      setLoading(false);
    }, 2000); // Simulating loading delay
  };

  return (
    <div
      className={`drop-zone ${dragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`upload-container ${videoUploaded ? 'button-shift' : ''}`}>
        <img 
          src={vidButton} 
          alt="Upload Button" 
          style={{ height: '800px', width: '530px' }} 
          className="vid-button"
        />
        {loading ? (
          <p>Loading...</p>
        ) : videoSrc ? (
          <div className="video-container">
            <video
              src={videoSrc}
              className="video-preview"
              autoPlay
              loop
              muted
              playsInline
            ></video>
          </div>
        ) : (
          <p>Drag video here</p>
        )}
      </div>
    </div>
  );
};

export default Uploader;
