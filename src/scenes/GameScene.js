/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import terrain from '../assets/map/terrain.png';
import map from '../assets/map/map.json'
import { Player, Zombie, Hero } from '../models';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('tilesets', terrain);
    this.load.tilemapTiledJSON('map', map);
    Player.preload(this);
    Zombie.preload(this);
    Hero.preload(this);
  }

  create () {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('terrain', 'tilesets', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0).setDepth(-1);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer2.setCollisionByProperty({ collides: true });
   
    this.matter.world.convertTilemapLayer(layer2);

   
    // this.player = new Zombie({
    //   scene: this, 
    //   x: this.game.config.width / 2, 
    //   y: this.game.config.height / 2, 
    //   texture: 'zombie', 
    //   frame: 'skeleton-idle_0'
    // });

    this.player = new Hero({
      scene: this, 
      x: 3000, 
      y: 3000, 
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
