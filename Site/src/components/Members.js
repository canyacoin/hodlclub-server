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
          return (<ListItem hodler={hodler} key={index} />)
        })
      }
    </div>);
  }
}

export default Members;
