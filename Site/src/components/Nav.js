import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

class Nav extends React.Component {

  render() {

    return (<div className="Nav">
      <div className="logo">
      </div>
      <div className="flexrow links">
          <Link to='form'>Join the club</Link>
          <Link to='/leaderboard'>Members</Link>
      </div>
    </div>);
  }
}

export default Nav;
