import React from 'react';
import './App.css';
import ListItem from './ListItem'
import ListHeader from './ListHeader'

class OGMembers extends React.Component {
constructor(props) {
  super(props)
  this.state = {
    hodlClub: [
      {
        name: 'Adjective Adjective Noun',
        address: '0xB543659Ee4eafE6144c8BD58278C30446A7fea9e',
        balance: 999,
        age: 45,
        isOG: true
      }, {
        name: 'Adjective Adjective Noun',
        address: '0xB543659Ee4eafE6144c8BD58278C30446A7fea9e',
        balance: 999,
        age: 45,
        isOG: true
      }, {
        name: 'Adjective Adjective Noun',
        address: '0xB543659Ee4eafE6144c8BD58278C30446A7fea9e',
        balance: 999,
        age: 45,
        isOG: true
      }
    ]
  }
}

  render() {
    return (
      <div className="OGMembers">
      <div className="ListItem flexrow">
        <div className="listItemData">
          <a className="data">Address</a>
        </div>
      </div>
      <ListHeader />
      {
        this.state.hodlClub.map((hodler, index) => {
          return (
            <ListItem
              name={hodler.name}
              address={hodler.address}
              airdrop={hodler.airdrop}
              age={hodler.age}
              isOG={hodler.isOG}
              key={index}
            />
          )
        })
      }
      </div>
    );
  }
}

export default OGMembers;
