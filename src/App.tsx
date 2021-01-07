/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import './App.css';
import Menu from './pages/menu';
import StartGame from './pages/start-game'
// import Game from './modules/game';

class App extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={ Menu }/>
        <Route  path="/start" component={ StartGame }/>
        <Redirect to="/"/>
      </Switch> 
    )
  }
}
 
export default App;
