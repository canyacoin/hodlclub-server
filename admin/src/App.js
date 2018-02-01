import React, {Component} from 'react';
import './App.css';
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

  toggleOG (index) {
    console.log("Toggle")
    console.log(this.state.results[index])
  }

  blacklist (index) {
    console.log(`Blacklisted this bitch > ${this.state.results[index]}`)
  }

  render() {
    return (<div className="App">
      <Header/>
      <Filter performSearch={this.performSearch} />
      <List results={this.state.results} blacklist={this.blacklist} toggleOG={this.toggleOG} searchFields={this.state.searchFields} />
    </div>);
  }
}

export default App;
