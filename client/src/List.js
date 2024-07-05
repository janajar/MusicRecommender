import React from 'react'
import './List.css';
import ListCard from './ListCard.js';

function List() {
  return (
    <div>
        <ListCard /> 
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
    </div>
  );
}

export default List;