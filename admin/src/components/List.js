import React, { Component } from 'react';
import '../App.css';
import ListItem from './ListItem'
 
class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hodler: {
        ethAddress: "0xddfdacea2fb6404fcd56fa9e920a1911693d5a7e",
        emailAddress: "firstname@business.com.au",
        discordHandle: "David_Duke#4412",
        isOG: true,
        becameHodlerAt: "0123145123",
        balance: "100000000",
      }
    }
  }
  render() {
    return (
      <div className="List">
      <hr />
      <ListItem hodler = {this.state.hodler} />
      <ListItem hodler = {this.state.hodler} />
      <ListItem hodler = {this.state.hodler} />
      <ListItem hodler = {this.state.hodler} />
      {
          this.props.results.map((member, index) => {
            return (
              <ListItem
                hodler={member}
                toggleOG={() => this.props.toggleOG(index)}
                blacklist={() => this.props.blacklist(index)}
                key={index}
              />
            )
          })
      }
      </div>
    );
  }
}

export default List;
