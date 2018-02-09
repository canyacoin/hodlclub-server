import React from 'react';
import { Switch, Route } from 'react-router-dom'
import './App.css';
import Members from './Members';
import OGMembers from './OGMembers'
import Join from './Join'
import Home from './Home'

class Main extends React.Component {


  render() {
    return (
      <div className="Main">
      <Switch>
        <Route path='/members' render={(props) => (
          <Members hodlClub={this.props.hodlClub} search={this.props.search} loadMore={this.props.loadMore} moreToLoad={this.props.moreToLoad} />
        )} />
        <Route path='/og-members' render={(props) => (
          <Members hodlClub={this.props.hodlOG} loadMore={this.props.loadMoreOG} search={this.props.search}/>
        )} />
        <Route path='/join' component={Join}/>
        <Route exactly path='/' component={Home}/>
      </Switch>
    </div>);
  }
}

export default Main;
