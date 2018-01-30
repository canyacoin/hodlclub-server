import React from 'react';
import { Switch, Route } from 'react-router-dom'
import './App.css';
import Members from './Members';
import Form from './Form'

class Main extends React.Component {


  render() {
    return (
      <div className="Main">
      <Switch>
      <Route path='/members' render={(props) => (
        <Members hodlClub={this.props.hodlClub} />
      )} />

      <Route path='/form' component={Form}/>
    </Switch>
    </div>);
  }
}

export default Main;
