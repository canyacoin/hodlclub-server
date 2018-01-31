import React from 'react';
import './App.css';

class SearchAddress extends React.Component {
  render() {
    return (
      <div className="SearchAddress flexrow">
      <div className="searchPanel flexcol">
      <h3>HODL Club Members List</h3>
      <p>Lorem ipsum dolor amet pBR&B try-hard humblebrag est dreamcatcher lomo 3 wolf moon. Deep v literally ramps, authentic ipsum meditation tempor art party in put a bird on it pinterest offal adipisicing. Chartreuse squid raclette adaptogen williamsburg tumeric, normcore hammock microdosing pinterest paleo whatever. Consequat blue bottle poke roof party eu. Intelligentsia tote bag banh mi church-key distillery.</p>
      </div>
      <div className="searchPanel">
      <h3>Search your address</h3>
        <input className="searchInput monospace" placeholder="wallet address 0x"/>
      </div>
      </div>
    );
  }
}

export default SearchAddress;
