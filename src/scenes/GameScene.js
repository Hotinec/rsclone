/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import terrain from '../assets/map/terrain.png';
import map from '../assets/map/map.json'
import earth from '../assets/scorched_earth.png';
import bullet from '../assets/weapon/laser.png';
import { Player, Zombie, Hero, Weapon, Laser, LaserGroup } from '../models';
import cursor from '../assets/PngItem_2912951.cur';
import { Physics } from './Physics';
//import { EvalDevToolModulePlugin } from 'webpack';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('spark', bullet);
    this.load.image('tilesets', terrain);
    this.load.tilemapTiledJSON('map', map);
    this.load.image('earth', earth);
    Player.preload(this);
    Zombie.preload(this);
    Hero.preload(this);
    Weapon.preload(this);
    Laser.preload(this);
  }

  newZombie(x, y) {
    this.zombie = new Zombie({scene: this, x:  x , y: y, texture: 'zombie', frame: 'skeleton-idle_0'});
    return this.zombie;
  }

  create () {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('terrain', 'tilesets', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0).setDepth(-1);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer2.setCollisionByProperty({ collides: true });
   
    // this.matter.world.convertTilemapLayer(layer2)
    this.add.tilemap('map');
    this.weapon = new Weapon({scene: this, x:  (this.game.config.width / 2) , y: this.game.config.height / 2 + 200, texture: 'pistol', frame: 'weapon-idle_0'})
    this.newZombie();
    //this.zombie = new Zombie({scene: this, x:  (this.game.config.width / 2) , y: this.game.config.height / 2 + 200, texture: 'zombie', frame: 'skeleton-idle_0'})
    this.player = new Hero({
      scene: this, 
      x: map.widthInPixels / 2, 
      y: map.heightInPixels / 2, 
      texture: 'knife', 
      frame: 'survivor-idle_knife_0'
    });
    this.zombies = this.physics.add.group();
    this.zombies.add(this.zombie);
    this.laserGroup = new LaserGroup(this);

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

    this.input.on('pointerdown', (pointer) => {
      this.fireDelta = 0;
      console.log(this.player)
      this.player.isAttack = true;
      //this.shootLaser(pointer);
      this.shoot = true;
      this.pointMouse = pointer;
    });
    this.input.on('pointerup', (pointer) => {
      console.log(this.player)
      this.player.isAttack = false;
      this.shoot = false;
    });
    this.physics.add.collider(this.player, layer2, null, null, this);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physicsEvent = new Physics(this, map);
    this.physicsEvent.setCollide(this.zombies);
    this.cameras.main.startFollow(this.player);
  }

  shootLaser(pointer, delta) {
    this.laserGroup.fireLaser(this.player.x, this.player.y - 20, pointer.x, pointer.y);
    this.fireDelta = 0;
  }

  update() {
    if(this.shoot){
      this.fireDelta++;
      if(this.fireDelta % 10 === 0){
      this.shootLaser(this.pointMouse);}
    }
    if(this.player.active === true) this.player.update(this.pointer);
    if(this.weapon.active === true) this.weapon.update();

    if(this.zombies.getChildren().length !== 0){
    for(let i = 0; i < this.zombies.getChildren().length; i++){
      this.physicsEvent.accellerateTo(this.zombies.getChildren()[i], this.player);
      //this.physics.accelerateToObject(this.zombies.getChildren()[i], this.player, 40, 40, 40);
    }};  
  }
}
