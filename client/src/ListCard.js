import React from 'react';
import './ListCard.css';

function ListCard({ index, title, author, downloadUrl }) {
  const cardClass = (index + 1) % 2 === 0 ? 'blue-listcard' : 'red-listcard';

  return (
    <div className={`card ${cardClass}`}>
      <h2 className="title">{title}</h2>
      <p className="author">{author}</p>
      <div className="audio-container">
        <audio controls className="audio">
          <source src={downloadUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default ListCard;