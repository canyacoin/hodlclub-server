import React from 'react';
import './App.css';
import Nav from './Nav';
import Main from './Main'
import ApiService from '../services/Api'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.getHodlClubMembers = this.getHodlClubMembers.bind(this)
    this.state = {
      showMe: true,
      hodlClub: [],
      loading: false,
      moreToLoad: true
    }
  }

  componentDidMount () {
    this.getHodlClubMembers()
  }

  /**
   *  Fetches the hodl club from the API
   */
  async getHodlClubMembers () {
    if (this.state.loading) return
    this.setState({ loading: true })
    let oldHodlers = this.state.hodlClub
    let numberToGet = 40
    let numberToSkip = this.state.hodlClub.length
    let hodlers = await ApiService.getHodlers(numberToGet, numberToSkip)
    if (hodlers.length === 0) return this.setState({ moreToLoad: false, loading: false })
    this.setState({ hodlClub: oldHodlers.concat(hodlers), loading: false })
  }

  async getStats (address) {
    return new Promise(async (resolve) => {
      resolve(await ApiService.getStats(address))
    })
  }

  render() {
    return (<div className="App">
      <Nav/>
      <hr />
      <Main 
        hodlClub={this.state.hodlClub}
        search={this.getStats}
        loadMore={(page) => this.getHodlClubMembers(page)}
        moreToLoad={this.state.moreToLoad}
      />
    </div>);
  }
}

export default App;
