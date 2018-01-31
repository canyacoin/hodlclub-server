import React from 'react';
import './App.css';
import ListItem from './ListItem'
import SearchAddress from './SearchAddress'

class Members extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div className="Members">
      <SearchAddress />
      {
        this.props.hodlClub.map((hodler, index) => {
          return (
            <ListItem
              name={hodler.name}
              address={hodler.address}
              airdrop={hodler.airdrop}
              age={hodler.age}
              status={hodler.status}
              key={index}
              og={true}
            />
          )
        })
      }
      </div>
    );
  }
}

export default Members;
