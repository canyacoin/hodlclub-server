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
      hodlClub: []
    }
    console.log(this.state.hodlClub)
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
