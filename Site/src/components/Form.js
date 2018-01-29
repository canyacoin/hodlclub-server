import React from 'react';
import './App.css';

class Form extends React.Component {

  constructor(props) {
    super(props)
    this.formSubmit = this.formSubmit.bind(this)
    this.state = {

    }
  }

  formSubmit () {
    console.log("You've submitted the Form")
  }

  render() {
    return (
      <div className="flexcol">
      <h1>Join the HODL club</h1>
      <p>Lorem ipsum dolor amet pBR&B try-hard humblebrag est dreamcatcher lomo 3 wolf moon. Deep v literally ramps, authentic ipsum meditation tempor art party in put a bird on it pinterest offal adipisicing. Chartreuse squid raclette adaptogen williamsburg tumeric, normcore hammock microdosing pinterest paleo whatever. Consequat blue bottle poke roof party eu. Intelligentsia tote bag banh mi church-key distillery.</p>
      <form className="form flexcol" onSubmit={this.formSubmit}>
        <h2>Your full name:</h2>
        <input className="formInput monospace" placeholder="John Citizen"/>
        <h2>Your email address:</h2>
        <input className="formInput monospace" placeholder="person@email.com"/>
        <h2>Your wallet address:</h2>
        <input className="formInput monospace" placeholder="0x00123456789abcdefedcba987654321"/>
        <button className="formButton" type="submit">Sign Up</button>
      </form>
      </div>
    );
  }
}

export default Form;
