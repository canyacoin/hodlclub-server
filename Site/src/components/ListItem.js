import React from 'react';
import './App.css';
const threewords = require('threewords');


class ListItem extends React.Component {
  render() {

    const threeWordsName = threewords(this.props.address)
    const newchar = ' '
    const formattedThreeWordsName = threeWordsName.split('-').join(newchar);


    return (
      <div className="ListItem flexrow">
        <div className="listItemBox flexcol">
          <a className="threewords">{formattedThreeWordsName}</a>
          <a className="walletId">{this.props.address}</a>
          </div>
        <div className="listItemBox">
          {this.props.age} Days
        </div>
        <div className="listItemBox">
          {this.props.balance}  CAN
        </div>
    </div>);
  }
}

export default ListItem;
