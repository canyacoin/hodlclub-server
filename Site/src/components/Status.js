import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

class Status extends React.Component {

  constructor(props) {
    super(props)
    this.renderNotApplied = this.renderNotApplied.bind(this)
    this.renderApplied = this.renderApplied.bind(this)
    this.renderDaysRemaining = this.renderDaysRemaining.bind(this)
    this.renderAppliedDaysRemaining = this.renderAppliedDaysRemaining.bind(this)
    this.state = {
      stats: {
        balance: 38100000000,
        becameHodlerAt: 1507679477,
        ethAddress: '0x834df7fc8adef83b6e3609bcd1d0871daeffe821',
        isOG: false,
        isApplied: true
      }
    }
  }

  renderApplied() {
    return (<p className="searchStatus monospace">
      It looks like you've successfully applied to join.
    </p>)
  }

  renderNotApplied() {
    return (<p className="searchStatus monospace">
      It looks like the owner of this address is yet to apply.&nbsp;
      <Link to='/join'>Click here to begin.</Link>
    </p>)
  }

  renderDaysRemaining() {
    return (<p className="searchStatus monospace">
      You're also {45 - this.props.getDaysHodled(this.state.stats.becameHodlerAt)}
      &nbsp;days away from HODL Club membership, HODL those CanYa tokens!
    </p>)
  }

  renderAppliedDaysRemaining() {
    return (<p className="searchStatus monospace">
      You're {45 - this.props.getDaysHodled(this.props.stats.becameHodlerAt)}
      &nbsp;days away from HODL Club membership, HODL those CanYa tokens!
    </p>)
  }

  giveStatus() {
    let stats = this.state.stats
    if (stats.isApplied && this.props.getDaysHodled(this.state.becameHodlerAt)) {
      return this.renderAppliedDaysRemaining()
    }
  }
  // @todo (alex) make a component which will handle each state
  // - not a hodler
  // - hodler for less than 45 days & not applied
  // - hodler for more than 45 days & not applied
  // - hodler for more than 45 days & applied (member!!)
  // - OG
  // - hodler for less than 45 days & already applied

  render() {
    return (<div className="Status">
      <div className="flexrow aligncentre">
        <div className="balance">
          Balance: {this.props.stats.balance / (Math.pow(10, 6))}
        </div>
        <div className="">
          Days HODL'd: {this.props.getDaysHodled(this.props.becameHodlerAt)}
        </div>
      </div>
      {this.giveStatus()}
      <button onClick={() => console.log(this.props.stats)} />
    </div>);
  }
}

export default Status;
