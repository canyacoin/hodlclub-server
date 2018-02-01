import React, { Component } from 'react';
import '../App.css';

class Header extends Component {
  render() {
    return (
      <div className="Header flexrow">
      <img className="logo" src={require('./assets/hodl_logo.jpg')}/>
      <h1>ADMIN PANEL</h1>
      </div>
    );
  }
}

export default Header;
