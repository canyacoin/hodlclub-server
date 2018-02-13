import React from 'react'

class Footer extends React.Component {
  render() {
    return(
      <div className="Footer">
        <div className="footerContent aligncentre">
          <a href="www.google.com.au">Built by FLEX Dapps.</a>
          <p>&nbsp;&nbsp;We build neat, self-contained decentralised applications and smart contracts.</p>
        </div>
        <img className="footer-img" src={require("./assets/wave.jpg")}/>
      </div>
    )
  }
}

export default Footer
