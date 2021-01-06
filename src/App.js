import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import GameScene from './modules/game/scenes';
import './App.css';

class App extends Component {
 
  state = {
    initialize: true,
    game: {
      width: window.innerWidth,
      height: window.innerHeight,
      type: Phaser.CANVAS,
      scene: [GameScene]
    }
  }
 
  render() {
    const { initialize, game } = this.state

    return (
      <div id="game"></div>
      // <IonPhaser 
      //   game={game} 
      //   initialize={initialize} />
    )
  }
}
 
export default App;
