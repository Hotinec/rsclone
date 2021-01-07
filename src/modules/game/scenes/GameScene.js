/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import earth from '../../../assets/scorched_earth.png';
import Player from '../models/Player';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('earth', earth);
    Player.preload(this);
  }

  create () {
    // TODO Fix *2
    this.add.tileSprite(0, 0, window.innerWidth * 2, window.innerHeight * 2, 'earth');
    this.player = new Player({scene: this, x: 200, y: 200, texture: 'town_male', frame: 'townsfolk_m_idle_1'});
    let testPlayer  = new Player({scene: this, x: 100, y: 100, texture: 'town_male', frame: 'townsfolk_m_idle_1'});
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update() {
    this.player.update();
  }
}
