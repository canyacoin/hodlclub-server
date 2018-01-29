import React from 'react';
import { Switch, Route } from 'react-router-dom'
import './App.css';
import Leaderboard from './Leaderboard';
import Form from './Form'

class Main extends React.Component {


  render() {
    return (
      <div className="Main">
      <Switch>
      <Route path='/leaderboard' render={(props) => (
        <Leaderboard hodlClub={this.props.hodlClub} />
      )} />

      <Route path='/Form' component={Form}/>
    </Switch>
    </div>);
  }
}

export default Main;
