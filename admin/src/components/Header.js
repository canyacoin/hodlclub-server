import React, { Component } from 'react';
import '../App.css';

class Header extends Component {
  render() {
    return (
      <div className="Header">
      <img height="70%" src={require('./assets/hodl_logo.jpg')}/>
      <h1>ADMIN PANEL</h1>
      </div>
    );
  }
}

export default Header;
