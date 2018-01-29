import React from 'react';
import './App.css';
import Nav from './Nav';
import Main from './Main'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMe: true,
      hodlClub: [
        {
          name: 'Boring Attributed Leather',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }, {
          name: 'Readily pineal finkle',
          address: '0xdaAeC253e5b224463917B4233D6b2B68E2cf9365',
          airdrop: 9999,
          status: 'OG-Hodler',
          age: 100
        }
      ]
    }
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
