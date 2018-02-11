import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

class Home extends React.Component {
  render() {
    return (<div className="Home">
    <img className="image" width="80%" src={require('./assets/canya_featured-images-airdrop-distribution.jpg')} />
      <h1>Introducing the CanYa HODL Club</h1>
      <p>The aim of the CanYa HODL Club is to get as many <em><b>long term believers of the CanYaCoin Token together in an exclusive group while also rewarding them</b></em> for their loyalty with air-dropped tokens from CanYa and our partners.&nbsp;<Link to="/join">Click here to sign up now.</Link>
      <br /><br />
      The CanYa ICO has broken away from the current status quo.
      Our team is sick of seeing ICO after ICO over-promising and under-delivering. We are also sick of seeing ICO tokens get dumped on exchanges at the earliest time possible so people can make a quick buck. CanYa is here for the long-term and we want our ICO contributors to be with us all the way. So what are the benefits of being in the HODL Club?</p>
      <img className="image"  width="80%" src={require('./assets/canya_featured-images-2500-can.jpg')}/>
      <h2>Joining the CanYa HODL Club is mutually beneficial for a number of reasons:</h2>
      <br />
      <h3>Short term:</h3>
      <p>Over the next 6 months CanYa HODL Club members will be air-dropped 2.5m CAN tokens at random times. This is across the two HODL club tiers with 2m tokens going to the OG HODLers (10k CAN entry) and 500k going to tier 2 members (2500 CAN entry). They will also be air-dropped our partners tokens over this time frame. You will also be part of an awesome community via our HODL website and invite only Telegram.</p>
      <h3>Longer term:</h3>
      <p>Once a year, the rewards pool will air-drop an amount of CAN tokens to those in the HODL Club which will again be based on their token balance. <em><b>This means the longer you are a member of the club, the higher your proportion of air-dropped tokens will be as people leave the club.</b></em> We will also regularly share information on our roadmap execution to our HODL Club and give them breaking news – first.</p>
      <br/>
        <img className="image" width="80%" src={require('./assets/canya_featured-images-merch.jpg')}/>
      <p>We also plan to regularly give away CanYa merchandise such as <b><em>CanYa Ledger Nano S wallets, minted CanYaCoins, clothing and more!</em></b>&nbsp;&nbsp;These are only available to members of the CanYa HODL Club.</p>
      <img className="image" width="80%" src={require('./assets/canya_featured-images-hodl_graph.jpg')}/>
    </div>);
  }
}

export default Home;
