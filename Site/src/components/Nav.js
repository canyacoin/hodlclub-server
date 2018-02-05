import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

class Nav extends React.Component {

  render() {

    return (<div className="Nav">
      <img className="logo" alt="HODL_CLUB" src={require('./assets/hodl_logo.jpg')}/>
      <div className="flexrow links">
          <Link to='/'>About</Link>
          <Link to='/join'>Join the club</Link>
          <Link to='/members'>Members</Link>
          <Link to='/og-members'>OG Members</Link>
      </div>
    </div>);
  }
}

export default Nav;
