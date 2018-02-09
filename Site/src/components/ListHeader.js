import React from 'react';
import './App.css';

class ListHeader extends React.Component {
  render() {
    return (
      <div className="ListItem flexrow">
        <div className="listHeader-Wallet flexcol">
          <b>Wallet Address</b>
        </div>
        <div className="listItemRow">
          <span className="listItemDays sortHeading" onClick={() => {
            this.props.sort('days')
          }}><b>Days HODL'd</b></span>
          <span className="listItemBalance sortHeading" onClick={() => {
            this.props.sort('balance')
          }}><b>Token Balance</b></span>
        </div>
    </div>);
  }
}

export default ListHeader;
