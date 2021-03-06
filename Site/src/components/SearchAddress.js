import React from 'react'
import './App.css'
import Status from './Status'

const janSixthTimestamp = 1515196800
class SearchAddress extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      address: '',
      stats: {},
      notFound: false
    }
    this.getStats = this.getStats.bind(this)
  }

  async getStats (address) {
    let stats = await this.props.search(address)
    if (stats.length === 0) {
      this.setState({ notFound: true, stats: [] })
    } else {
      this.setState({ stats: stats, notFound: false })
    }
  }

  getDaysHodled (hodler) {
    let now = Math.floor(Date.now() / 1000)
    let timestamp
    if (hodler.isOG) {
      if (hodler.becameHodlerAt < janSixthTimestamp) {
        timestamp = hodler.becameHodlerAt
      } else {
        timestamp = janSixthTimestamp
      }
    } else {
      timestamp = hodler.becameHodlerAt
    }
    let diff = now - timestamp
    let days = Math.floor(diff / 86400)
    return days
  }

  getTotalMembers () {
    return this.props.hodlClub.length
  }

  getTotalCANInClub () {
    let totalCAN = 0
    for (let hodler of this.props.hodlClub) {
      totalCAN += hodler.balance
    }
    return (totalCAN / 1000000).toLocaleString()
  }

  render () {
    return (<div className="SearchAddress">
      <div className="searchPanel flexcol">
        <h3>HODL Club Members List</h3>
        <p>Over the next 6 months HODL Club members will be air-dropped 2.5m CAN tokens at random times. This is across the two HODL Club tiers with 2m tokens going to the OG HODLers (5k CAN from ICO or 10k CAN after the ICO) and 500k going to tier 2 members (2500 CAN entry) You will also be part of an awesome community via our HODL website and invite only Discord Server.</p>
        <div className="monospace">
          <span>Total {this.props.OG ? 'OG ' : ''}Hodlers: </span>
          <span>{this.getTotalMembers()}</span>
        </div>
        <div className="monospace">
          <span>Total CAN in the {this.props.OG ? 'OG ' : ''}HODL Club: </span>
          <span>{this.getTotalCANInClub()}</span>
        </div>
        <br/>
      </div>
      <div className="searchPanel">
        <h3>Check your HODL status.</h3>
        <div className="flexrow">
          <input className="searchInput monospace" placeholder="wallet address 0x" onChange={(e) => this.setState({address: e.target.value})}/>
          <button
            type="submit"
            className="searchButton"
            onClick={() => this.getStats(this.state.address)}
          >
            Search
          </button>
        </div>
        <Status getDaysHodled={this.getDaysHodled} stats={this.state.stats} notFound={this.state.notFound} />
        {
          Object.keys(this.state.stats).length !== 0 &&
          <div className="flexrow aligncentre">
            <div className="balance monospace">
            Balance: {Math.floor(this.state.stats.balance / (Math.pow(10, 6)))}
            </div>
            <div className="monospace">
            Days HODL'd: {this.getDaysHodled(this.state.stats)}
            </div>
          </div>
        }
      </div>
    </div>)
  }
}

export default SearchAddress
