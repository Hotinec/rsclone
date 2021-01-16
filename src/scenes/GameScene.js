/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import terrain from '../assets/map/terrain.png';
import map from '../assets/map/map.json'
import cursor from '../assets/PngItem_2912951.cur';
import { PLAYER_STATE } from '../constants'
import shootSound from '../assets/audio/pistol.wav';
import {
  Zombie,
  Hero,
  Weapon,
  Laser,
  LaserGroup,
  FireGroup,
  Fire
} from '../models';
import {
  Physics
} from '../Physics';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // map
    this.load.image('tilesets', terrain);
    this.load.tilemapTiledJSON('map', map);

    // models
    Zombie.preload(this);
    Hero.preload(this);
    Weapon.preload(this);
    Laser.preload(this);
    Fire.preload(this);

    // audio
    this.load.audio('shoot', shootSound);
  }

  newZombie(x, y) {
    this.zombie = new Zombie({
        scene: this,
        x: x,
        y: y,
        texture: 'zombie',
        frame: 'skeleton-idle_0'
      },
      this.player
    );

    return this.zombie;
  }

  create() {
    this.soundShoot = this.sound.add('shoot');

    // map creation
    const map = this.make.tilemap({
      key: 'map'
    });
    const tileset = map.addTilesetImage('terrain', 'tilesets', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0).setDepth(-1);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer2.setCollisionByProperty({
      collides: true
    });

    this.weapon = new Weapon({
      scene: this,
      x: (this.game.config.width / 2),
      y: this.game.config.height / 2 + 200,
      texture: 'pistol',
      frame: 'weapon-idle_0'
    });

    this.player = new Hero({
      scene: this,
      x: map.widthInPixels / 2,
      y: map.heightInPixels / 2,
      texture: 'handgun',
      frame: 'survivor-idle_handgun_0'
    });

    this.newZombie();

    this.zombies = this.physics.add.group();
    this.zombies.add(this.zombie);
    this.laserGroup = new LaserGroup(this);
    this.fireGroup = new FireGroup(this);

    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.knifeBounds = this.physics.add.image();

    this.pointer = {x: -230, y: -30};
    this.pointer = {
      x: -230,
      y: -30
    };

    this.input.on('pointermove', (pointer) => {
      this.pointer.x = pointer.x;
      this.pointer.y = pointer.y;
    });


    this.input.on('pointerup', (pointer) => {
      this.player.isAttack = false;
      this.shoot = false;
      this.player.isAttack = true;
      this.shootLaser(pointer);
      //shoot.play();
    });
    this.input.on('pointerdown', (pointer) => {
      this.player.state = PLAYER_STATE.ATTACK;
      // this.shootLaser(pointer);
      this.fireDelta = 0;
  
      //this.shootLaser(pointer);
      this.shoot = true;
      this.pointMouse = pointer;
    });

    this.physics.add.collider(this.player, layer2, null, null, this);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physicsEvent = new Physics(this, map);
    this.physicsEvent.setCollide(this.zombies, this.laserGroup);
    this.cameras.main.startFollow(this.player);
  }

  shootLaser(pointer, delta) {
    this.soundShoot.play();
    this.laserGroup.fireLaser(this.player.x , this.player.y , pointer.x, pointer.y);
    this.fireGroup.fireLaser(this.player.x, this.player.y, pointer.x, pointer.y);
    this.fireDelta = 0;
  }

  update() {
    this.player.update(this.pointer);

    if(this.player.state === PLAYER_STATE.ATTACK ){
      if(!this.knifeBounds.body){
        this.knifeBounds = this.physics.add.image();
      }
      this.knifeBounds.body.setCircle(45)
      this.knifeBounds.setDebugBodyColor(0xffff00);
      const v = this.player.body.velocity;
      this.knifeBounds.body.velocity.copy(v);

      const centerBodyOnXY = (a, x, y) => {
        a.position.set(
          x - a.halfWidth,
          y - a.halfHeight
        );
      }
      const centerBodyOnPoint = (a, p) => {
        centerBodyOnXY(a, p.x, p.y);
      }
      centerBodyOnXY(this.knifeBounds.body, this.player.body.x + 60, this.player.body.y + 35);
  
      this.player.body.updateCenter();
      this.knifeBounds.body.updateCenter();
  
      const RotateAround = Phaser.Math.RotateAround;
      RotateAround(this.knifeBounds.body.center, this.player.body.center.x, this.player.body.center.y, this.player.rotation);
  
      centerBodyOnPoint(this.knifeBounds.body, this.knifeBounds.body.center);
      this.knifeBounds.body.velocity.copy(this.player.body.velocity);

      if(this.player.anims.currentFrame.textureFrame === 'survivor-meleeattack_knife_13'){
        this.knifeBounds.destroy();
      }

    } 

    if(this.player.active === true) this.player.update(this.pointer);
    if(this.weapon.active === true) this.weapon.update();

    if(this.zombies.getChildren().length !== 0){
    for(let i = 0; i < this.zombies.getChildren().length; i++){
      this.physicsEvent.accellerateTo(this.zombies.getChildren()[i], this.player);
      //this.physics.accelerateToObject(this.zombies.getChildren()[i], this.player, 40, 40, 40);
    }};  
    if (this.shoot) {
      this.fireDelta++;
      if (this.fireDelta % 10 === 0) {
        this.shootLaser(this.pointMouse);
      }
    }
    if (this.player.active === true) this.player.update(this.pointer);
    if (this.weapon.active === true) this.weapon.update();

    if (this.zombies.getChildren().length !== 0) {
      for (let i = 0; i < this.zombies.getChildren().length; i++) {
        this.physicsEvent.accellerateTo(this.zombies.getChildren()[i], this.player);
      }
    };
  }
}
