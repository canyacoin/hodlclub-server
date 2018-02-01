import React, {Component} from 'react';
import './App.css';
import Header from './components/Header'
import List from './components/List'
import Filter from './components/Filter'

class App extends Component {
  constructor(props) {
    super(props)
    this.toggleOG = this.toggleOG.bind(this)
    this.state = {
      results: [
        {
          address: "0xB543659Ee4eafE6144c8BD58278C30446A7fea9e",
          isOG: false,
          balance: "999,999,999"
      },
      {
        address: "0xB543659Ee4eafE6144c8BD58278C30446A7fea9e",
        isOG: true,
        balance: "888,888,888"
    }
      ]
    }
  }

  toggleOG (index) {
    console.log("Toggle")
    console.log(this.state.results[index])
  }

  render() {
    return (<div className="App">
      <Header/>
      <Filter/>
      <List results={this.state.results} toggleOG={this.toggleOG}/>
    </div>);
  }
}

export default App;
