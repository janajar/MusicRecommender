import React from 'react'
import tikTokText from './img/header-TT-text.svg'
import engStudio from './img/eng-logo.png'
import './Header.css'
function Header() {
  return (
    <header className='header'>
      <img src={tikTokText} alt="TikTok Studio Logo" style={{ height: '50px', marginRight: '0 px' }} />
      <img src={engStudio} alt="TikTok Studio Logo PNG" style={{ height: '25px',  marginLeft: '10px' }} />
    </header>
  );
}

export default Header;