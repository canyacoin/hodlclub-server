import React from 'react';
import './App.css';

class ListItem extends React.Component {
  render() {
    return (
    <div className="ListItem flexrow">
      <div className="listItemData flexcol">
        <a className="name data">{this.props.name}</a>
        <a className="address data">{this.props.address}</a>
      </div>
      <div className="listItemData status flexcol aligncentre">
        <a>&#128081;</a>
        {this.props.status}
      </div>
      {this.props.age}
      {this.props.airdrop}
    </div>
        );
  }
}

export default ListItem;
