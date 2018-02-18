import React, {Component} from 'react'
import '../App.css'
import ApiService from '../services/Api'

class ListItem extends Component {

  getDaysHodled (timestamp) {
    let now = Math.floor(Date.now() / 1000)
    let diff = now - timestamp
    let days = Math.floor(diff / 86400)
    return days
  }

  getEtherscanLink (address) {
    return "https://etherscan.io/address/" + address
  }

  render() {
    let hodler = this.props.hodler
    return (
      <div className="ListItem flexrow">
        <div className="data flexcol">
          <a className="data" href={this.getEtherscanLink(hodler.ethAddress)} target="_blank">{hodler.ethAddress}</a>
          <a className="data">{hodler.emailAddress}</a>
          <a className="data">{hodler.discordHandle}</a>
        </div>
        <a className="data">{this.getDaysHodled(hodler.becameHodlerAt)}</a>
        <a className="data">{hodler.isOG ? 'OG' : 'Non-OG'}</a>
        <a className="data">{(Number(hodler.balance) / 1000000).toLocaleString()}</a>
        <div className="flexrow buttons">
          <button className={"resultButton data " + (hodler.isOG ? 'remove' : 'add')} onClick={() => this.props.toggleOG(hodler.ethAddress)}>
            { !hodler.isOG ? 'Make OG' : 'Remove OG' }
          </button>
          <button className={"resultButton data " + (hodler.blacklisted ? 'whitelist' : 'blacklist')} onClick={() => this.props.toggleBlacklist(hodler.address)}>
            { hodler.blacklisted ? 'Un-blacklist' : 'Blacklist' }
          </button>
        </div>
      </div>
    )
  }
}

export default ListItem;
