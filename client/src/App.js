import React, { useState } from 'react';
import Header from './Header.js';
import Confetti from './Confetti';
import Uploader from './Uploader';
import List from './List.js';
import './App.css';

const items = [
  { title: 'Sample Audio 1', author: 'SoundHelix', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Sample Audio 2', author: 'SoundHelix', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Sample Audio 3', author: 'SoundHelix', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Sample Audio 4', author: 'SoundHelix', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Sample Audio 5', author: 'SoundHelix', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
];

function App() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleUploadComplete = (videoURL) => {
    setVideoSrc(videoURL);
    setVideoUploaded(true);
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
  };

  return (
    <div>
      <Header />
      <Confetti />
      <div className="background">
        <Uploader 
          onUploadComplete={handleUploadComplete} 
          videoUploaded={videoUploaded} 
          videoSrc={videoSrc}
          onAnalysisComplete={handleAnalysisComplete}
        />
        {analysisResult && (
          <div>
            <h2>Personalized</h2>
            <List data={analysisResult.personalized} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;