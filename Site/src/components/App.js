import React from 'react'
import './App.css'
import Nav from './Nav'
import Main from './Main'
import Footer from './Footer'
import ApiService from '../services/Api'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.getHodlClubMembers = this.getHodlClubMembers.bind(this)
    this.getHodlOGMembers = this.getHodlOGMembers.bind(this)
    this.setSort = this.setSort.bind(this)
    this.setSortOG = this.setSortOG.bind(this)
    this.state = {
      showMe: true,
      hodlClub: [],
      hodlOG: [],
      loading: false,
      loadingOG: false,
      moreToLoad: true,
      sortBy: 'days',
      sortByOG: 'days'
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
    let numberToGet = 500
    let numberToSkip = sort ? 0 : this.state.hodlClub.length
    let hodlers = await ApiService.getHodlers(numberToGet, numberToSkip, sort)
    if (hodlers.length !== numberToGet) this.setState({ moreToLoad: false, loading: false })
    let newHolders = sort ? hodlers : oldHodlers.concat(hodlers)
    this.setState({ hodlClub: newHolders, loading: false })
  }

  async getHodlOGMembers (sort) {
    if (this.state.loadingOG) return
    this.setState({ loadingOG: true })
    let oldHodlers = this.state.hodlOG
    let numberToGet = 500
    let numberToSkip = sort ? 0 : this.state.hodlOG.length
    let OGhodlers = await ApiService.getHodlerOGs(numberToGet, numberToSkip, sort)
    if (OGhodlers.length !== numberToGet) this.setState({ moreToOGLoad: false, loadingOG: false })
    this.setState({ hodlOG: oldHodlers.concat(OGhodlers), loadingOG: false })
  }

  async getStats (address) {
    return new Promise(async (resolve) => {
      resolve(await ApiService.getStats(address))
    })
  }

  setSort (by) {
    this.setState({ sortBy: by })
    this.getHodlClubMembers(by)
  }

  setSortOG (by) {
    this.setState({ sortByOG: by })
    this.getHodlOGMembers(by)
  }

  render () {
    return (<div className="App">
      <Nav />
      <hr />
      <Main
        hodlClub={this.state.hodlClub}
        hodlOG={this.state.hodlOG}
        search={this.getStats}
        loadMore={this.getHodlClubMembers}
        loadMoreOG={this.getHodlOGMembers}
        moreToLoad={this.state.moreToLoad}
        setSort={this.setSort}
        setSortOG={this.setSortOG}
      />
      <Footer />
    </div>)
  }
}

export default App
