import React from 'react';
import './App.css';
import ApiService from '../services/Api'

class Join extends React.Component {

  constructor(props) {
    super(props)
    this.formSubmit = this.formSubmit.bind(this)
    this.submitApplication = this.submitApplication.bind(this)
    this.state = {
      email: '',
      ethAddress: '',
      discordName: '',
      discordNumber: '',
      invalidFields: []
    }
  }

  async submitApplication () {
    let { email, ethAddress, discordName, discordNumber } = this.state
    let discordHandle = discordName + '#' + discordNumber
    let result = await ApiService.submitApplication(email, discordHandle, ethAddress)
    if (result.success) {
      // do something nice
    } else {
      // something failed, print the message
    }
  }

  async formSubmit () {
    this.validateEmail(this.state.email)
    this.validateEthAddress(this.state.ethAddress)
    this.validateDiscordName(this.state.discordName)
    this.validateDiscordNumber(this.state.discordNumber)
    if (this.state.invalidFields.length === 0) {
      await this.submitApplication()
    }
  }

  validateEmail (input) {
    let invalidFields = this.state.invalidFields
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (re.test(input.toLowerCase())) return
    invalidFields.push('email')
    this.setState({invalidFields: invalidFields})
  }

  validateEthAddress (input) {
    let invalidFields = this.state.invalidFields
    let re = /^(0x)?([A-Fa-f0-9]{40})$/
    if (re.test(input.toLowerCase()) && input.indexOf('0x') > -1) return
    invalidFields.push('ethAddress')
    this.setState({invalidFields: invalidFields})
  }

  validateDiscordName (input) {
    let invalidFields = this.state.invalidFields
    let re = /^([^@^:]){2,32}$/
    if (re.test(input.toLowerCase())) return
    invalidFields.push('discordName')
    this.setState({invalidFields: invalidFields})
  }

  validateDiscordNumber (input) {
    let invalidFields = this.state.invalidFields
    let re = /^([0-9]){4}$/
    if (re.test(input.toString().toLowerCase())) return
    invalidFields.push('discordNumber')
    this.setState({invalidFields: invalidFields})
  }

  render() {
    return (
      <div className="Join flexcol">
        <h1>Join the HODL club</h1>
        <p>Lorem ipsum dolor amet pBR&B try-hard humblebrag est dreamcatcher lomo 3 wolf moon. Deep v literally ramps, authentic ipsum meditation tempor art party in put a bird on it pinterest offal adipisicing. Chartreuse squid raclette adaptogen williamsburg tumeric, normcore hammock microdosing pinterest paleo whatever. Consequat blue bottle poke roof party eu. Intelligentsia tote bag banh mi church-key distillery.</p>
        <h2>Your email address:</h2>
        <input
          type="email"
          className={`formInput monospace ${this.state.invalidFields.indexOf('email') === -1 ? '' : 'formError'}`}
          placeholder="hodlertilidie@gmail.com"
          onChange={(e) => {
            let invalidFields = this.state.invalidFields
            invalidFields.splice(invalidFields.indexOf('email'), 1)
            this.setState({email: e.target.value, invalidFields: invalidFields})
          }}
        />
        {
          this.state.invalidFields.indexOf('email') !== -1 &&
          <div className="formErrorDescription monospace">Email is invalid</div>
        }
        <h2>Your wallet address:</h2>
        <input 
          className={`formInput monospace ${this.state.invalidFields.indexOf('ethAddress') === -1 ? '' : 'formError'}`}
          placeholder="0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
          onChange={(e) => {
            let invalidFields = this.state.invalidFields
            invalidFields.splice(invalidFields.indexOf('ethAddress'), 1)
            this.setState({ethAddress: e.target.value, invalidFields: invalidFields})
          }}
        />
        {
          this.state.invalidFields.indexOf('ethAddress') !== -1 &&
          <div className="formErrorDescription monospace">Eth address is invalid</div>
        }
        <h2>Your Discord Username:</h2>
        <div className="flexrow">
          <div className="flexcol">
            <input
              className={`formInput monospace ${this.state.invalidFields.indexOf('discordName') === -1 ? '' : 'formError'}`}
              id="discord1"
              placeholder="OGCoinBoy"
              onChange={(e) => {
                let invalidFields = this.state.invalidFields
                invalidFields.splice(invalidFields.indexOf('discordName'), 1)
                this.setState({discordName: e.target.value, invalidFields: invalidFields})
              }}
            />
            {
              this.state.invalidFields.indexOf('discordName') !== -1 &&
              <div className="formErrorDescription monospace">Discord name is invalid</div>
            }
          </div>
          <div className="flexcol">
            <div className="flexrow">
              <input className="discordHash" placeholder="#" readOnly="readOnly"/>
              <input
                className={`formInput monospace ${this.state.invalidFields.indexOf('discordNumber') === -1 ? '' : 'formError'}`}
                type="number"
                id="discord2"
                placeholder="1337"
                min="0"
                max="9999"
                step="1"
                onChange={(e) => {
                  let invalidFields = this.state.invalidFields
                  invalidFields.splice(invalidFields.indexOf('discordNumber'), 1)
                  this.setState({discordNumber: e.target.value, invalidFields: invalidFields})
                }}
              />
            </div>
            {
              this.state.invalidFields.indexOf('discordNumber') !== -1 &&
              <div className="formErrorDescription monospace">Discord number is invalid</div>
            }
          </div>
        </div>
        <button className="formButton" type="submit" onClick={this.formSubmit}>Sign Up</button>
      </div>
    )
  }
}

export default Join;
