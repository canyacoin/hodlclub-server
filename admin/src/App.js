import React, {Component} from 'react';
import './App.css';
import Header from './components/Header'
import List from './components/List'
import Filter from './components/Filter'

class App extends Component {
  constructor(props) {
    super(props)
    // this.updateSearchFields = this.updateSearchFields.bind(this)
    this.toggleOG = this.toggleOG.bind(this)
    this.blacklist = this.blacklist.bind(this)
    this.state = {
      results: [
        {
          address: "0xB543659Ee4eafE6144c8BD58278C30446A7fea9e",
          isOG: false,
          balance: "999,999,999"
        }, {
          address: "0xB543659Ee4eafE6144c8BD58278C30446A7fea9e",
          isOG: true,
          balance: "888,888,888"
        }
      ],
      searchFields: {
        telegram: "",
        wallet: "",
        email: ""
      }
    }
  }

  // async componentDidMount() {
  //   let result = await ApiService.search('telegramHandle', 'emailAddress', 'ethereumAddress')
  //   console.log(result)
  // }

  toggleOG (index) {
    console.log("Toggle")
    console.log(this.state.results[index])
  }

  blacklist (index) {
    console.log(`Blacklisted this bitch > ${this.state.results[index]}`)
  }
  // updateSearchFields (field, data) {
  //   let searchFields = Object.assign({}, this.state.searchFields);
  //   searchFields[field] = data
  //   this.setState({searchFields: searchFields})
  // }

  render() {
    return (<div className="App">
      <Header/>
      <Filter updateField={this.updateField}/>
      <List results={this.state.results} blacklist={this.blacklist} toggleOG={this.toggleOG} searchFields={this.state.searchFields} />
    </div>);
  }
}

export default App;
