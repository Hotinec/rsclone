/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import terrain from '../assets/map/terrain.png';
import mapJSON from '../assets/map/map.json';
import blood from '../assets/blood/blood.png';
import { PLAYER_STATE } from '../constants';
import cursor from '../assets/cursor.cur';
import shootSound from '../assets/audio/pistol.wav';
import knifeAttacke from '../assets/audio/knifeAttack.wav';
import knifeHit from '../assets/audio/knifeHit.wav';
import {
  Zombie,
  Hero,
  Weapon,
  Laser,
  LaserGroup,
  FireGroup,
  Fire,
  Ammo,
} from '../models';
import {
  Physics,
} from '../Physics';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');

    this.weapon = null;
    this.score = 0;
  }

  preload() {
    this.load.image('blood', blood);

    // map
    this.load.image('tilesets', terrain);
    this.load.tilemapTiledJSON('map', mapJSON);
    this.scene.launch('StatusScene');

    // models
    Zombie.preload(this);
    Hero.preload(this);
    Weapon.preload(this);
    Laser.preload(this);
    Fire.preload(this);
    Ammo.preload(this);

    // audio
    this.load.audio('shoot', shootSound);
    this.load.audio('khife_attack', knifeAttacke);
    this.load.audio('knife_hit', knifeHit);
  }

  newZombie(x, y) {
    this.zombie = new Zombie({
      scene: this,
      x,
      y,
      texture: 'zombie',
      frame: 'skeleton-idle_0',
    },
    this.player);
    return this.zombie;
  }

  create() {
    this.input.setDefaultCursor(`url(${cursor}), auto`);

    // add sound
    this.soundShoot = this.sound.add('shoot');
    this.soundKnifeAttack = this.sound.add('khife_attack');
    this.soundKnifeHit = this.sound.add('knife_hit');

    //   this.data.set('armore', 10);
    //   this.data.set('level', 1);
    //   this.data.set('score', 0);
    //   this.text = this.add.text(100, 100, {font: '64px, Courier', fill:'#00ff00'});
    //   this.text.setText([
    //     'armore :' + this.data.get('armore'),
    //     'level :' + this.data.get('level'),
    //     'score :' + this.data.get('score'),
    //   ])
    //  this.text.setScrollFactor(0);

    // map creation
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('terrain', 'tilesets', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0).setDepth(-1);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer2.setCollisionByProperty({
      collides: true,
    });

    // this.input.setDefaultCursor('url(./src/assets/cursor.cur), auto');

    this.player = new Hero({
      scene: this,
      x: map.widthInPixels / 2,
      y: map.heightInPixels / 2,
      texture: 'knife',
      frame: 'survivor-idle_knife_0',
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
      knife: Phaser.Input.Keyboard.KeyCodes.ONE,
      pistol: Phaser.Input.Keyboard.KeyCodes.TWO,
      shotgun: Phaser.Input.Keyboard.KeyCodes.THREE,
      rifle: Phaser.Input.Keyboard.KeyCodes.FOUR,
    });

    this.knifeBounds = this.physics.add.image();

    this.pointer = {
      x: -230,
      y: -30,
    };

    // Events
    this.input.on('pointermove', (pointer) => {
      this.pointer.x = pointer.x;
      this.pointer.y = pointer.y;
    });

    this.input.on('pointerup', (pointer) => {
      // this._shootLaser(pointer);
      if (this.player.anim === 'rifle') this.player.state = PLAYER_STATE.IDLE;
    });

    this.input.on('pointerdown', (pointer) => {
      this.fireDelta = 0;

      if (this.player.anim === 'knife' && this.player.state !== PLAYER_STATE.ATTACK) {
        setTimeout(() => this.soundKnifeAttack.play(), 500);
      }

      this.player.state = PLAYER_STATE.ATTACK;
      this.pointMouse = pointer;
    });

    this.physics.add.collider(this.player, layer2, null, null, this);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.physicsEvent = new Physics(this, map);
    this.physicsEvent.setCollide(this.zombies, this.laserGroup);

    this.cameras.main.startFollow(this.player);
  }

  _shootLaser(pointer, delta) {
    if (this.player.anim === 'knife') {
      if (!this.knifeBounds.body) {
        this.knifeBounds = this.physics.add.image();
      }
      this.physicsEvent.killZombieWithKnife();
      if (this.player.anims.currentFrame.textureFrame === 'survivor-meleeattack_knife_12'
      || this.player.anims.currentFrame.textureFrame === 'survivor-meleeattack_knife_13'
      || this.player.anims.currentFrame.textureFrame === 'survivor-meleeattack_knife_14') {
        this.knifeBounds.destroy();
        this.player.state = PLAYER_STATE.IDLE;
      }
    } else {
      const delBulletFromAmmo = (gun) => {
        this.laserGroup.magazine[`${gun}`] -= 1;
        if (this.laserGroup.magazine[`${gun}`] === 0) {
          this.laserGroup.reload(this.player.anim);
        }
        this.soundShoot.play();
        this.fireGroup.fireLaser(this.player.x, this.player.y, pointer.x, pointer.y);
      };

      const fire = (gun) => {
        this.laserGroup.fireLaser(this.player.x, this.player.y, pointer.x, pointer.y);
        delBulletFromAmmo(gun);
      };

      if (this.player.anim === 'shotgun' && this.laserGroup.magazine.shotgun !== 0 && this.laserGroup.magazine.shotgunAll > -1) {
        for (let i = 0; i < 6; i++) {
          this.laserGroup.fireLaser(
            this.player.x, this.player.y,
            pointer.x + i * 10, pointer.y + i * 10,
          );
        }
        delBulletFromAmmo(this.player.anim);
      // eslint-disable-next-line no-mixed-operators
      }
      if (this.player.anim === 'handgun' && this.laserGroup.magazine.handgun !== 0) {
        fire(this.player.anim);
      }
      if (this.player.anim === 'rifle' && this.laserGroup.magazine.rifle !== 0 && this.laserGroup.magazine.rifleAll > -1) {
        fire(this.player.anim);
      }

      this.fireDelta = 0;
      if (this.player.anim !== 'rifle') this.player.state = PLAYER_STATE.IDLE;
    }
  }

  createWeapon(posX, posY, texture) {
    this.weapon = new Weapon({
      scene: this,
      x: posX,
      y: posY,
      texture,
    });
  }

  createAmmo(posX, posY, texture) {
    this.ammo = new Ammo({
      scene: this,
      x: posX,
      y: posY,
      texture,
    });
  }

  update() {
    if (this.player.state === PLAYER_STATE.ATTACK) {
      this.fireDelta++;
      if (this.fireDelta % 10 === 0) {
        this._shootLaser(this.pointMouse);
      }
    }

    if (this.player.active === true) this.player.update(this.pointer);
    if (this.weapon && this.weapon.active === true) this.weapon.update();

    if (this.zombies.getChildren().length !== 0) {
      for (let i = 0; i < this.zombies.getChildren().length; i++) {
        this.physicsEvent.accellerateTo(this.zombies.getChildren()[i], this.player);
      }
    }
  }
}
