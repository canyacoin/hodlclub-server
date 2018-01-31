import React from 'react';
import './App.css';
import ListItem from './ListItem'

class Home extends React.Component {
  render() {
    return (<div className="Home">
      <h1>Introducing the CanYa HODL Club</h1>
      <p>The CanYa ICO is breaking from the current status quo. Our team is sick of seeing ICO after ICO over-promising and under-delivering. We are also sick of seeing ICO tokens get dumped on exchanges at the earliest time possible so people can make a quick buck. CanYa is here for the long-termand we want our ICO contributors to be with us all the way. What is the benefits of being in the HODL Club?</p>
      <h2>Joining the CanYa HODL club is mutually beneficial for a number of reasons:</h2>
      <h3>Short term:</h3>
      <p>Over the next 6 months CanYa HODL club members will be air-dropped 2 million CAN tokens at random times. They will also be air-dropped our partners tokens over this time frame.</p>
      <br/>
      <p>You will also be part of an awesome community via our HODL website and invite only Telegram.</p>
      <h3>Longer term:</h3>
      <p>Once a year, the rewards pool will air-drop an amount of CAN tokens to those in the HODL club which will again be based on their token balance. This means the longer you are a member of the club, the higher your proportion of air-dropped tokens will be as people leave the club. We will also regularly share information on our roadmap execution to our HODL Club and give them breaking news – first.</p>
      <br/>
      <p>We also plan to regularly give away CanYa merchandise such as CanYa Ledger Nano S wallets, minted CanYaCoins, clothing and more! These are only available to members of the CanYa HODL Club.</p>

    </div>);
  }
}

export default Home;
