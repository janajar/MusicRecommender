import React from 'react'
import logo from './img/logo.svg'
import './Header.css'
function Header() {
  return (
    <header className='header'>
      <img src={logo} alt="TikTok Studio Logo" style={{ height: '50px', marginRight: '10px' }} />
      <h1>
        TikTok Engagement Studio
      </h1>
    </header>
  );
}

export default Header;