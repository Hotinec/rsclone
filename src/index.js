/* eslint-disable no-unused-vars */
import Phaser from 'phaser';

import {
  GameScene, LoadScene, MenuScene, StatusScene, PauseScene,
} from './scenes';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#33333',
  parent: 'game',
  scene: [MenuScene, LoadScene, GameScene, StatusScene, PauseScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  audio: {
    disableWebAudio: true,
  },
};

const Game = new Phaser.Game(config);
