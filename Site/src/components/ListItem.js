import React from 'react';
import './App.css';
const threewords = require('threewords');


class ListItem extends React.Component {

  getDaysHodled (timestamp) {
    let now = Math.floor(Date.now() / 1000)
    let diff = now - timestamp
    let days = Math.floor(diff / 86400)
    return days
  }

  getEtherscanUrl (address) {
    return "https://etherscan.io/address/" + address
  }

  render() {
    const hodler = this.props.hodler
    const threeWordsName = threewords(hodler.ethAddress)
    const newchar = ' '
    const formattedThreeWordsName = threeWordsName.split('-').join(newchar);


    return (
      <div className="ListItem flexrow">
      {hodler.isOG ?
        <a className="isOG">{'\uD83D\uDC51'}</a> :
        ""}
        <div className="listItemBox flexcol">
          <a className="threewords">{formattedThreeWordsName}</a>
          <a className="walletId" href={this.getEtherscanUrl(hodler.ethAddress)} target="_blank">{hodler.ethAddress}</a>
          </div>
        <div className="listItemBox">
          {this.getDaysHodled(hodler.becameHodlerAt)} Days
        </div>
        <div className="listItemBox">
          {Math.floor(hodler.balance / (Math.pow(10, 6)))}  CAN
        </div>
    </div>);
  }
}

export default ListItem;
