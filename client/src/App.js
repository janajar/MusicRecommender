import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header.js';
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

    setVideoSrc(videoURL);

    const formData = new FormData();
    formData.append('video', videoFile);

    axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('File uploaded successfully:', response.data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div>
      <Header />
      <Confetti />
      <div className="background">
        <div className="white-box">
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
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
    </div>
  );
}

export default App;