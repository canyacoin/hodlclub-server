import React from 'react';
import './App.css';
import { renderToStaticMarkup } from 'react-dom/server';
import ApiService from '../services/Api'
import SweetAlert from 'sweetalert-react'

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
      invalidFields: [],
      disableInputs: false,
      showAlert: false,
      alert: {
        title: '',
        text: ''
      }
    }
    this.successHtml =
      <div>
        <div className="alertText">
          You're in the Hodl Club!, click this Discord link to join the server and an Admin will give 
          you access to the exclusive Hodl Club chat!
        </div>
        <a href="https://discord.gg/55Guqtk" target="_blank">https://discord.gg/55Guqtk</a>
      </div>
  }

  renderFailMessage (failText) {
    return (
      <div>
        <div className="alertText">
          There was an error submitting your application.<br/>
          {failText}
        </div>
      </div>
    )
  }

  async submitApplication () {
    this.setState({disableInputs: true})
    let { email, ethAddress, discordName, discordNumber } = this.state
    let discordHandle = discordName + '#' + discordNumber
    let result = await ApiService.submitApplication(email, discordHandle, ethAddress)
    if (result.success) {
      // do something nice and clear the inputs
      this.setState({email: '', ethAddress: '', discordName: '', discordNumber: '', disableInputs: false, showAlert: true})
      this.setState({
        alert: {
          title: 'Success!',
          text: this.successHtml}})
    } else {
      // something failed, print the message
      this.setState({disableInputs: false, showAlert: true, alert: {title: 'Oops!', text: this.renderFailMessage(result.errors[0])}})
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
    if (!input.toLowerCase()) return
    let invalidFields = this.state.invalidFields
    let re = /^([^@^:]){2,32}$/
    if (re.test(input.toLowerCase())) return
    invalidFields.push('discordName')
    this.setState({invalidFields: invalidFields})
  }

  validateDiscordNumber (input) {
    if (!input) return
    let invalidFields = this.state.invalidFields
    let re = /^([0-9]){4}$/
    if (re.test(input.toString().toLowerCase())) return
    invalidFields.push('discordNumber')
    this.setState({invalidFields: invalidFields})
  }

  render() {
    return (
      <div className="Join flexcol">
        <h3>Join the HODL Club</h3>
        <p>
          Members of the HODL Club get access to the <b>private discord channel</b>, as well as <b>exclusive airdrops</b>. In order to be eligible to apply for the HODL Club, make sure you have 2.5k CAN in your wallet, and wait at least a couple of hours before going through the application process. Once we see that you've hodled your tokens for 45 days, we'll invite you to the Discord, where the real party happens!
        </p>
        <p>
          <b>Note:</b> You don't have to go through this application process to be eligible for airdrops (you still need to hodl your tokens though), but we recommend it so that we can help you out if you have any issues.
        </p>
        <h2>Your email address:</h2>
        <input
          type="email"
          className={`formInput monospace ${this.state.invalidFields.indexOf('email') === -1 ? '' : 'formError'}`}
          placeholder="hodlertilidie@gmail.com"
          value={this.state.email}
          disabled={this.state.disableInputs}
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
          value={this.state.ethAddress}
          disabled={this.state.disableInputs}
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
              value={this.state.discordName}
              disabled={this.state.disableInputs}
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
                value={this.state.discordNumber}
                disabled={this.state.disableInputs}
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
        <SweetAlert
          show={this.state.showAlert}
          title={this.state.alert.title}
          html
          text={renderToStaticMarkup(this.state.alert.text)}
          onConfirm={() => this.setState({ showAlert: false })}
        />
      </div>
    )
  }
}

export default Join;
