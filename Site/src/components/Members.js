import React from 'react';
import './App.css';
import ListItem from './ListItem'

class Members extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div className="Members">
      <div className="ListItem flexrow">
        <div className="listItemData">
          <a className="data">Address</a>
        </div>
      </div>
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
            />
          )
        })
      }
      </div>
    );
  }
}

export default Members;
