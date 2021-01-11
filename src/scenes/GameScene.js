/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import earth from '../assets/scorched_earth.png';
import { Player, Zombie, Hero } from '../models';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('earth', earth);
    Player.preload(this);
    Zombie.preload(this);
    Hero.preload(this);
  }

  create () {
    // TODO Fix *2
    this.add.tileSprite(0, 0, window.innerWidth * 2, window.innerHeight * 2, 'earth');
    
    // this.player = new Zombie({
    //   scene: this, 
    //   x: this.game.config.width / 2, 
    //   y: this.game.config.height / 2, 
    //   texture: 'zombie', 
    //   frame: 'skeleton-idle_0'
    // });

    this.player = new Hero({
      scene: this, 
      x: this.game.config.width / 2, 
      y: this.game.config.height / 2, 
      texture: 'knife', 
      frame: 'survivor-idle_knife_0'
    });
    
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.pointer = {x: -230, y: -30};

    this.input.on('pointermove', (pointer) => {
      this.pointer.x = pointer.x;
      this.pointer.y = pointer.y;
    });

    this.input.on('pointerdown', function (pointer) {
      isDown = true;
      mouseX = pointer.x;
      mouseY = pointer.y;
  });

    this.cameras.main.startFollow(this.player);
  }

  update() {
    this.player.update(this.pointer);
  }
}
