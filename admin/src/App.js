import React, {Component} from 'react'
import './App.css'
import Header from './components/Header'
import List from './components/List'
import Filter from './components/Filter'
import ApiService from './services/Api'

class App extends Component {
  constructor(props) {
    super(props)
    this.performSearch = this.performSearch.bind(this)
    this.toggleOG = this.toggleOG.bind(this)
    this.blacklist = this.blacklist.bind(this)
    this.state = {
      results: []
    }
  }

  async performSearch (ethAddress, telegram, email) {
    let results = await ApiService.search(telegram, email, ethAddress)
    this.setState({ results: results })
  }

  async toggleOG (index) {
    let hodler = this.state.results[index]
    let result = await ApiService.makeOG(hodler.ethAddress)
    if (result.success) this.state.results[index].isOG = !hodler.isOG
    this.forceUpdate()
  }

  async blacklist (index) {
    let hodler = this.state.results[index]
    let result = await ApiService.blacklist(hodler.ethAddress)
    if (result.success) this.state.results[index].blacklisted = !hodler.blacklisted
    this.forceUpdate()
  }

  async downloadAll () {
    await ApiService.exportHodlers()
  }

  async downloadMembers () {
    await ApiService.exportMembers()
  }

  async downloadApplications () {
    await ApiService.exportApplications()
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <Filter
          performSearch={this.performSearch}
          downloadAll={this.downloadAll}
          downloadMembers={this.downloadMembers}
          downloadApplications={this.downloadApplications}
        />
        <List
          results={this.state.results}
          blacklist={this.blacklist}
          toggleOG={this.toggleOG}
          searchFields={this.state.searchFields}
        />
      </div>
    )
  }
}

export default App
