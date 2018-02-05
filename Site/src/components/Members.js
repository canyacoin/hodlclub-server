import React from 'react';
import './App.css';
import ListItem from './ListItem'
import SearchAddress from './SearchAddress'
import ListHeader from './ListHeader'

class Members extends React.Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (<div className="Members">
      <SearchAddress search={this.props.search}/>
      <ListHeader />
      {
        this.props.hodlClub.map((hodler, index) => {
          return (<ListItem name={hodler.name} address={hodler.address} balance={hodler.balance} age={hodler.age} isOG={hodler.isOG} key={index} og={hodler.og}/>)
        })
      }
    </div>);
  }
}

export default Members;
