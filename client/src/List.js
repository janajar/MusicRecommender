import React from 'react';
import './List.css';
import ListCard from './ListCard.js';

const List = ({ data }) => {
  return (
    <div className="list">
      {data.map((item, index) => (
        <ListCard
          key={index}
          index={index}
          title={item.title}
          author={item.author}
          downloadUrl={item.url}
        />
      ))}
    </div>
  );
};

export default List;