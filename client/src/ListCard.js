import React from 'react';
import './ListCard.css';

function ListCard({ title, author, downloadUrl }) {
  return (
    <div className="card">
      <h2 className="title">{title}</h2>
      <p className="author">{author}</p>
      <audio controls className="audio">
        <source src={downloadUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default ListCard;