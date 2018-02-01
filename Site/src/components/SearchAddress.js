import React from 'react';
import './App.css';

class SearchAddress extends React.Component {
  render() {
    return (<div className="SearchAddress flexrow">
      <div className="searchPanel flexcol">
        <h3>HODL Club Members List</h3>
        <p>Lorem ipsum dolor amet pBR&B try-hard humblebrag est dreamcatcher lomo 3 wolf moon. Deep v literally ramps, authentic ipsum meditation tempor art party in put a bird on it pinterest offal adipisicing. Chartreuse squid raclette adaptogen williamsburg tumeric.</p>
      </div>
      <div className="searchPanel">
        <h3>Check your HODL status.</h3>
        <form className="flexrow">
          <input className="searchInput monospace" placeholder="wallet address 0x"/>
          <button type="submit" className="searchButton">Search</button>
        </form>
        <div className="searchResults">
        <div>
        Balance: {"2500"} | Days HODL'd: {"123"}
        </div>
        <p className="searchStatus monospace">
          You're {'X'}
          days away from joining HODL Club admission, HODL your CanYa tokens!
        </p>
        </div>
      </div>
    </div>);
  }
}

export default SearchAddress;
