import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

class Status extends React.Component {

  constructor(props) {
    super(props)
    this.renderNotApplied = this.renderNotApplied.bind(this)
    this.renderApplied = this.renderApplied.bind(this)
    this.isHodl45 = this.isHodl45.bind(this)
    this.isMember = this.isMember.bind(this)
    this.returnDays = this.returnDays.bind(this)
    this.state = {
      stats: {
        balance: 38100000000,
        becameHodlerAt: 1507679477,
        ethAddress: '0x834df7fc8adef83b6e3609bcd1d0871daeffe821',
        isOG: true,
        applied: false
      }
    }
  }

  renderApplied() {
    return (<p className="searchStatus monospace">
      Thanks! You've successfully applied to join. You just need to wait {this.returnDays()} Days until you're in the club.
    </p>)
  }

  renderNotApplied() {
    return (<p className="searchStatus monospace">
      It looks like you've already HODL'd for {this.returnDays()} days, you just need to apply.&nbsp;
      <Link to='/join'>Click here to begin.</Link>
    </p>)
  }

  renderIsOG() {
    return (<p className="searchStatus monospace">
      You're an {'\uD83D\uDC51'} OG Hodler {'\uD83D\uDC51'}
    </p>)
  }
  isHodl45() {
    return this.props.getDaysHodled(this.props.stats.becameHodlerAt) > 45
  }

  returnDays () {
    let requiredDays = (45 - this.props.getDaysHodled(this.props.stats.becameHodlerAt))
    if (requiredDays > 0) {
      return requiredDays
    } else {
      return this.props.getDaysHodled(this.props.stats.becameHodlerAt)
    }
  }

  isOG() {
    return this.props.stats.isOG
  }

  isMember() {
    return (<p className="searchStatus monospace">Approved HODL Club Member.</p>)
  }

  componentDidMount() {
    console.log(this.returnDays())
  }
  giveStatus() {
    let stats = this.props.stats
    if (stats.applied) {
      if (this.isHodl45()) {
        return this.isMember()
      } else {
        return this.renderApplied()
      }
    }
    else {
      if (this.isOG()) {
        return (this.renderIsOG())
      } else {
        return (this.renderNotApplied())
      }
    }
  }
    render() {

      return (<div className="Status">
        <div className="flexrow aligncentre">
          <div className="balance">
            Balance: {this.props.stats.balance / (Math.pow(10, 6))}
          </div>
          <div>
            Days HODL'd: {this.props.getDaysHodled(this.props.becameHodlerAt)}
          </div>
        </div>
        {this.giveStatus()}
      </div>)
    }
  }

  export default Status;
