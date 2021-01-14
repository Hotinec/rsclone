/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import terrain from '../assets/map/terrain.png';
import map from '../assets/map/map.json'

import { Zombie, Hero } from '../models';
import cursor from '../assets/PngItem_2912951.cur';
import { PLAYER_STATE } from '../constants'

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('tilesets', terrain);
    this.load.tilemapTiledJSON('map', map);

    Zombie.preload(this);
    Hero.preload(this);
  }

  create () {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('terrain', 'tilesets', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0).setDepth(-1);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer2.setCollisionByProperty({ collides: true });

    this.player = new Hero({
      scene: this, 
      x: map.widthInPixels / 2, 
      y: map.heightInPixels / 2, 
      texture: 'knife', 
      frame: 'survivor-idle_knife_0'
    });

    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.knifeBounds = this.physics.add.image();
    this.knifeBounds.body.setCircle(28)
    this.knifeBounds.setDebugBodyColor(0xffff00);
    const v = this.player.body.velocity;
    this.knifeBounds.body.velocity.copy(v);


    this.pointer = {x: -230, y: -30};

    this.input.on('pointermove', (pointer) => {
      this.pointer.x = pointer.x;
      this.pointer.y = pointer.y;
    });

    this.input.on('pointerdown', (pointer) => {
      this.player.state = PLAYER_STATE.ATTACK;
    });
    this.physics.add.collider(this.player, layer2, null, null, this);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
  }

  update() {
    this.player.update(this.pointer);

    const centerBodyOnXY = (a, x, y) => {
      a.position.set(
        x - a.halfWidth,
        y - a.halfHeight
      );
    }
    const centerBodyOnPoint = (a, p) => {
      centerBodyOnXY(a, p.x, p.y);
    }
    centerBodyOnXY(this.knifeBounds.body, this.player.body.x + 90, this.player.body.y + 20);

    this.player.body.updateCenter();
    this.knifeBounds.body.updateCenter();

    const RotateAround = Phaser.Math.RotateAround;
    RotateAround(this.knifeBounds.body.center, this.player.body.center.x, this.player.body.center.y, this.player.rotation);

    centerBodyOnPoint(this.knifeBounds.body, this.knifeBounds.body.center);
    this.knifeBounds.body.velocity.copy(this.player.body.velocity);
  }
}
