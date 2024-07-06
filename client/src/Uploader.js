import React, { useState } from 'react';
import axios from 'axios';
import './Uploader.css'; // Ensure the CSS file is correctly imported

function VideoUpload() {
  const [videoPreview, setVideoPreview] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('video', file);

      try {
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        setIsUploaded(true);
      } catch (error) {
        console.error('Error uploading the video', error);
      }
    } else {
      alert('Please select a valid video file');
      setVideoPreview('');
    }
  };

  return (
    <div className={`video-upload-container ${isUploaded ? 'uploaded' : ''}`}>
      {!isUploaded && (
        <>
          <input
            type="file"
            id="file-input"
            className="custom-file-input"
            onChange={handleFileChange}
            accept="video/*"
          />
          <label htmlFor="file-input" className="custom-file-label">
            Select Video
          </label>
        </>
      )}
      {videoPreview && (
        <video className="video-preview" controls>
          <source src={videoPreview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export default VideoUpload;
