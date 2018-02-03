import React from 'react';
import './App.css';

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

  // @todo (tom) implement this function
  getDaysHodled (pastTimestamp) {
    return 45
  }

  render() {
    return (<div className="SearchAddress flexrow">
      <div className="searchPanel flexcol">
        <h3>HODL Club Members List</h3>
        <p>Lorem ipsum dolor amet pBR&B try-hard humblebrag est dreamcatcher lomo 3 wolf moon. Deep v literally ramps, authentic ipsum meditation tempor art party in put a bird on it pinterest offal adipisicing. Chartreuse squid raclette adaptogen williamsburg tumeric.</p>
      </div>
      <div className="searchPanel">
        <h3>Check your HODL status.</h3>
        <div className="flexrow">
          <input className="searchInput monospace" placeholder="wallet address 0x" onChange={(e) => this.setState({address: e.target.value})}/>
          <button type="submit" className="searchButton" onClick={() => this.getStats(this.state.address)}>Search</button>
        </div>
        {
          // @todo (alex) make a component which will handle each state
          // - not a hodler
          // - hodler for less than 45 days & not applied
          // - hodler for more than 45 days & not applied
          // - hodler for less than 45 days & already applied
          // - hodler for more than 45 days & applied (member!!)
          // - OG
          (Object.keys(this.state.stats).length !== 0) &&
          <div className="searchResults">
            <div>
              Balance: {this.state.stats.balance / (Math.pow(10, 6))} | Days HODL'd: {this.getDaysHodled(this.state.stats.becameHodlerAt)}
            </div>
            <p className="searchStatus monospace">
              You're {45 - this.getDaysHodled(this.state.stats.becameHodlerAt)} 
              days away from joining HODL Club admission, HODL your CanYa tokens!
            </p>
          </div>
        }
      </div>
    </div>);
  }
}

export default SearchAddress;
