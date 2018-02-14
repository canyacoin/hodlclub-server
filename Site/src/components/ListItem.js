import React from 'react'
import './App.css'
import Blockies from 'react-blockies'
import threewords from 'threewords-happy'

class ListItem extends React.Component {
  getDaysHodled (timestamp) {
    let now = Math.floor(Date.now() / 1000)
    let diff = now - timestamp
    let days = Math.floor(diff / 86400)
    return days
  }

  getEtherscanUrl (address) {
    return 'https://etherscan.io/address/' + address
  }

  render () {
    const hodler = this.props.hodler
    const threeWordsName = threewords(hodler.ethAddress)
    const newchar = ' '
    const formattedThreeWordsName = threeWordsName.split('-').join(newchar)

    return (<div className="ListItem">
      <div className="listItemStack">
        <div className="blockies flexcol">
          {
            hodler.isOG
              ? <a className="isOG">{'\uD83D\uDC51'}</a>
              : ''
          }
          <Blockies seed={hodler.ethAddress}/>
        </div>
        <div className="listItemBox listItemAddress flexcol">
          <span className="threewords">{formattedThreeWordsName}</span>
          <a className="walletId" href={this.getEtherscanUrl(hodler.ethAddress)} target="_blank">{hodler.ethAddress}</a>
        </div>
      </div>
      <div className="listItemRow">
        <div className="listItemBox listItemDays">
          {this.getDaysHodled(hodler.becameHodlerAt)}
        &nbsp;Days
        </div>
        <div className="listItemBox listItemBalance">
          {Math.floor(hodler.balance / (Math.pow(10, 6)))}&nbsp;
        CAN
        </div>
      </div>
    </div>)
  }
}

export default ListItem
