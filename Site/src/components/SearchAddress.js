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

  // @todo (tom) implement this function
  getDaysHodled (pastTimestamp) {
    return 45
    //Cheers cunt
  }

  render() {
    return (<div className="SearchAddress flexrow">
      <div className="searchPanel flexcol">
        <h3>HODL Club Members List</h3>
        <p>Find any address in the HODL Club by searching here. If you've signed up to join the club and want to check your status or you've been hodling but haven't completed the sign up form you can easily check your eligibility or status here.</p>
      </div>
      <div className="searchPanel">
        <h3>Check your HODL status.</h3>
        <div className="flexrow">
          <input className="searchInput monospace" placeholder="wallet address 0x" onChange={(e) => this.setState({address: e.target.value})}/>
          <button
            type="submit"
            className="searchButton"
            onClick={() => this.getStats(this.state.address)}>
            Search
          </button>
        </div>
        <Status getDaysHodled={this.getDaysHodled}stats={this.state.stats}/>
      </div>
    </div>);
  }
}

export default SearchAddress;
