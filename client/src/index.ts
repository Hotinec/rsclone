import Phaser from 'phaser';

import {
  GameScene, LoadScene, MenuScene, StatusScene, PauseScene, GameOverScene,
} from './scenes';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#33333',
  parent: 'game',
  scene: [MenuScene, LoadScene, GameScene, StatusScene, PauseScene, GameOverScene],
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
  dom: {
    createContainer: true,
  },
  audio: {
    disableWebAudio: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Game: Phaser.Game = new Phaser.Game(config);
