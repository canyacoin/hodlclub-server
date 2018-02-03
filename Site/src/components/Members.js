import React from 'react';
import './App.css';
import ListItem from './ListItem'
import SearchAddress from './SearchAddress'
import ListHeader from './ListHeader'

class Members extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hodlClub: [
        {
          name: 'Adjective Adjective Noun',
          address: '0xB543659Ee4eafE6144c8BD58278C30446A7fea9e',
          balance: 999,
          age: 45,
          status: 'isOG',
          og: true
        }, {
          name: 'Adjective Adjective Noun',
          address: '0xB543659Ee4eafE6144c8BD58278C30446A7fea9e',
          balance: 999,
          age: 45,
          status: 'isOG',
          og: true
        }, {
          name: 'Adjective Adjective Noun',
          address: '0xB543659Ee4eafE6144c8BD58278C30446A7fea9e',
          balance: 999,
          age: 45,
          status: 'isOG',
          og: true
        }
      ]
    }
  }
  render() {
    return (<div className="Members">
      <SearchAddress search={this.props.search}/>
      <ListHeader />
      {
        this.state.hodlClub.map((hodler, index) => {
          return (<ListItem name={hodler.name} address={hodler.address} balance={hodler.balance} age={hodler.age} status={hodler.status} key={index} og={hodler.og}/>)
        })
      }
    </div>);
  }
}

export default Members;
