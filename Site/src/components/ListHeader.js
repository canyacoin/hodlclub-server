import React from 'react';
import './App.css';

class ListHeader extends React.Component {
  render() {
    return (
      <div className="flexrow">
        <div className="listHeader-Wallet flexcol">
        Wallet Address:
          </div>
        <div className="listHeader-Data">
        <a className="listHeader-Data-a">Days HODL'd:</a>
        <a className="listHeader-Data-a"/>
        <a className="listHeader-Data-a">Token Balance:</a>
        </div>
    </div>);
  }
}

export default ListHeader;
