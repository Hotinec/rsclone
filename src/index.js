import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import GameScene from './scenes';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#33333',
  parent: 'game',
  scene: [ GameScene ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    // default: 'matter',
    // matter: {
    //   debug: true,
    //   gravity: { y: 0 }
    // }
    default: "arcade",
      arcade: {
        debug: true
      }
  },
  // plugins: {
  //   scene: [
  //     {
  //       plugin: PhaserMatterCollisionPlugin,
  //       key: 'matterCollision',
  //       mapping: 'matterCollision'
  //     }
  //   ]
  // }
};

const Game = new Phaser.Game(config);
