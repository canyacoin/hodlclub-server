import React from 'react';
import './App.css';

class ListItem extends React.Component {
  render() {
    return (<div className="ListItem flexrow">
      <div className="listItemBox flexcol">
        <a>{this.props.name}</a>
        <a className="walletId">{this.props.address}</a>
      </div>
      <div className="listItemBox">
        {this.props.age}
        Days
      </div>
      {this.props.airdrop}
    </div>);
  }
}

export default ListItem;
