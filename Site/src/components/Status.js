import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

class Status extends React.Component {

  constructor(props) {
    super(props)
    this.renderNotApplied = this.renderNotApplied.bind(this)
    this.renderApplied = this.renderApplied.bind(this)
    this.isHodl45 = this.isHodl45.bind(this)
    this.returnMember = this.returnMember.bind(this)
    this.returnDays = this.returnDays.bind(this)
    this.renderDefault = this.renderDefault.bind(this)
    this.state = {
      default: true
    }
  }

  renderDefault () {
    return (
      <p className="searchStatus monospace">
      Search any address in the field above to see it's standing with the HODL Club. <Link to='/about'>Find out about the minimum requirements to join here.</Link> </p>
    )
  }

  renderApplied() {
    return (<p className="searchStatus monospace">
      Thanks! You've successfully applied to join. You just need to wait {this.returnDays()} Days until you're in the club.
    </p>)
  }

  renderNotApplied() {
    return (<p className="searchStatus monospace">
      It looks like you've already HODL'd for {this.props.getDaysHodled(this.props.stats.becameHodlerAt)} days, you just need to apply.&nbsp;
      <Link to='/join'>Click here to begin.</Link>
    </p>)
  }

  renderIsOG() {
    return (<p className="searchStatus monospace">
      You're an {'\uD83D\uDC51'} OG Hodler {'\uD83D\uDC51'}
    </p>)
  }

  returnDays () {
    let daysHodled = this.props.getDaysHodled(this.props.stats.becameHodlerAt)
    let requiredDays = (45 - daysHodled)
    if (requiredDays > 0) {
      return requiredDays
    } else {
      return daysHodled
    }
  }

  returnMember() {
    return (<p className="searchStatus monospace">Approved HODL Club Member.</p>)
  }

  isHodl45() {
    return this.props.getDaysHodled(this.props.stats.becameHodlerAt) > 45
  }

  isOG() {
    return this.props.stats.isOG
  }

  giveStatus() {
    let stats = this.props.stats
    if (Object.keys(stats).length !== 0) {
      if (stats.applied) {
        if (this.isHodl45()) {
          return this.returnMember()
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
    } else {
      return this.renderDefault()
    }
  }

    render() {
      return (<div className="Status">
        <div className="flexrow aligncentre">
        </div>
        {this.giveStatus()}
      </div>)
    }
  }

  export default Status;
