import React, {Component} from 'react'
import '../App.css'

class Filter extends Component {

  constructor (props) {
    super(props)
    this.state = {
      telegram: '',
      ethAddress: '',
      email: ''  
    }
  }

  render() {
    return (
      <div className="Filter">
        <div className="flexrow">
          <input className="filterInput" placeholder="Telegram" onChange={(e) => this.setState({telegram: e.target.value})} />
          <input className="filterInput" placeholder="Ether Wallet" onChange={(e) => this.setState({ethAddress: e.target.value})} />
        </div>
        <div className="flexrow">
          <input className="filterInput" placeholder="Email"/>
          <div className="downloads flexrow">
            <button className="filterButton" onClick={this.props.downloadAll}>All</button>
            <button className="filterButton" onClick={this.props.downloadMembers}>45 Days</button>
            <button className="filterButton" onClick={this.props.downloadApplications}>Applications</button>
            <button type="submit" className="searchButton" 
              onClick={() => this.props.performSearch(this.state.ethAddress, this.state.telegram, this.state.email)}
            >Search</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Filter
