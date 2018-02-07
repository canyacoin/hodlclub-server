import React, { Component } from 'react';
import '../App.css';
import ListItem from './ListItem'

class List extends Component {
  render() {
    return (
      <div className="List">
      <hr />
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
