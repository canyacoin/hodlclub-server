import React, {Component} from 'react';
import '../App.css';

class Filter extends Component {
  render() {
    return (<div className="Filter">
      <form>
        <div className="flexrow">
          <input className="filterInput" placeholder="Telegram"/>
          <input className="filterInput" placeholder="Ether Wallet"/>
        </div>
        <div className="flexrow">
          <input className="filterInput" placeholder="Email"/>
          <div className="downloads flexrow">
            <button className="filterButton">All</button>
            <button className="filterButton">45 Days</button>
            <button className="filterButton">Applications</button>
            <button type="submit" className="searchButton">Search</button>
          </div>
        </div>
      </form>
    </div>);
  }
}

export default Filter;
