import React, {Component} from 'react'
import '../App.css'
import FA from 'react-fontawesome'

class Filter extends Component {

  constructor (props) {
    super(props)
    this.state = {
      discord: '',
      ethAddress: '',
      email: ''
    }
  }

  render() {
    return (
      <div className="Filter">
        <div className="filterInputs">
          <div className="filterInput">
            <a>Discord Handle:</a>
              <input placeholder="Discord" onChange={(e) => this.setState({discord: e.target.value})} />
          </div>
          <div className="filterInput">
            <a>Email Address:</a>
            <input className="filterInput longInput" placeholder="Email" onChange={(e) => this.setState({email: e.target.value})}/>
          </div>
          <div className="filterInput">
            <a>Ether Wallet:</a>
            <input className="filterInput longInput" placeholder="Ether Wallet" onChange={(e) => this.setState({ethAddress: e.target.value})} />
          </div>
        </div>
        <div className="buttonContainer">
          <div class="searchContainer">
            <button
              className="actionButton"
              onClick={() => this.props.performSearch(this.state.ethAddress, this.state.discord, this.state.email)}
            >
              <FA name="search" /> Search
            </button>
          </div>
          <div className="downloadContainer">
            <button className="filterButton actionButton" onClick={this.props.downloadAll}>
              <FA name="download" /> All
            </button>
            <button className="filterButton actionButton" onClick={this.props.downloadMembers}>
              <FA name="download" /> 45 Days
            </button>
            <button className="filterButton actionButton" onClick={this.props.downloadApplications}>
              <FA name="download" /> Applications
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Filter
