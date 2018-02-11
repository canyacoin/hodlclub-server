import React from 'react';
import './App.css';
import Nav from './Nav';
import Main from './Main'
import Footer from './Footer'
import ApiService from '../services/Api'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.getHodlClubMembers = this.getHodlClubMembers.bind(this)
    this.getHodlOGMembers = this.getHodlOGMembers.bind(this)
    this.state = {
      showMe: true,
      hodlClub: [],
      hodlOG: [],
      loading: false,
      loadingOG: false,
      moreToLoad: true
    }
  }

  componentDidMount () {
    this.getHodlClubMembers()
    this.getHodlOGMembers()
  }

  /**
   *  Fetches the hodl club from the API
   */
  async getHodlClubMembers (sort) {
    if (this.state.loading) return
    this.setState({ loading: true })
    let oldHodlers = this.state.hodlClub
    let numberToGet = 40
    let numberToSkip = this.state.hodlClub.length
    let hodlers = await ApiService.getHodlers(numberToGet, numberToSkip, sort)
    if (hodlers.length === 0) return this.setState({ moreToLoad: false, loading: false })
    this.setState({ hodlClub: oldHodlers.concat(hodlers), loading: false })
  }

  async getHodlOGMembers (sort) {
    if (this.state.loadingOG) return
    this.setState({ loadingOG: true })
    let oldHodlers = this.state.hodlOG
    let numberToGet = 40
    let numberToSkip = this.state.hodlOG.length
    let OGhodlers = await ApiService.getHodlerOGs(numberToGet, numberToSkip, sort)
    if (OGhodlers.length === 0) return this.setState({ moreToOGLoad: false, loadingOG: false })
    this.setState({ hodlOG: oldHodlers.concat(OGhodlers), loadingOG: false })
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
        hodlOG={this.state.hodlOG}
        search={this.getStats}
        loadMore={(sort) => this.getHodlClubMembers(sort)}
        loadMoreOG={(sort) => this.getHodlOGMembers(sort)}
        moreToLoad={this.state.moreToLoad}
      />
      <Footer />
    </div>);
  }
}

export default App;
