import React from 'react';
import './App.css';
import Nav from './Nav';
import Main from './Main'
import ApiService from '../services/Api'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.getHodlClubMembers = this.getHodlClubMembers.bind(this)
    this.getHodlClubMembers()
    this.state = {
      showMe: true,
      hodlClub: [
        // {
        //   name: 'Boring Attributed Leather',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }, {
        //   name: 'Readily pineal finkle',
        //   address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
        //   airdrop: 9999,
        //   status: 'OG-Hodler',
        //   age: 100
        // }
      ]
    }
  }

  /**
   *  Fetches the hodl club from the API
   */
  async getHodlClubMembers () {
    let hodlers = await ApiService.getHodlers(20)
    this.setState({ hodlClub: hodlers })
  }

  render() {
    return (<div className="App">
      <Nav/>
      <hr />
      <Main hodlClub={this.state.hodlClub}/>
    </div>);
  }
}

export default App;
