import React from 'react';
import './App.css';
import Status from './Status'

class SearchAddress extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      address: '',
      stats: {}
    }
    this.getStats = this.getStats.bind(this)
  }

  async getStats (address) {
    let stats = await this.props.search(address)
    this.setState({ stats: stats })
  }

  getDaysHodled(timestamp) {
    let now = Math.floor(Date.now() / 1000)
    let diff = now - timestamp
    let days = Math.floor(diff / 86400)
    return days
  }

  render() {
    return (<div className="SearchAddress">
      <div className="searchPanel flexcol">
        <h3>HODL Club Members List</h3>
        <p>Over the next 6 months HODL club members will be air-dropped 500,000 CAN tokens at random times. You will also be part of an awesome community via our HODL website and invite only Discord Server.</p>
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
        <Status getDaysHodled={this.getDaysHodled}stats={this.state.stats}/>
        {
          Object.keys(this.state.stats).length !== 0 &&
          <div className="flexrow aligncentre">
            <div className="balance monospace">
            Balance: {Math.floor(this.state.stats.balance / (Math.pow(10, 6)))}
            </div>
            <div className="monospace">
            Days HODL'd: {this.getDaysHodled(this.state.stats.becameHodlerAt)}
            </div>
          </div>
        }
      </div>
    </div>);
  }
}

export default SearchAddress;
