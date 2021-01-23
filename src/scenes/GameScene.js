/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
import terrain from '../assets/map/terrain.png';
import mapJSON from '../assets/map/map.json';
import blood from '../assets/blood/blood.png';
import firstAid from '../assets/first-aid-kit.png';
import { PLAYER_STATE, ZOMBIE_TYPE, WEAPON } from '../constants';
import cursor from '../assets/cursor.cur';
import shootSound from '../assets/audio/pistol.wav';
import knifeAttacke from '../assets/audio/knifeAttack.wav';
import reload from '../assets/audio/reload.wav';
import top from '../assets/audio/top.wav';
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
import { Physics } from '../Physics';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');

    this.weapon = null;
    this.score = 0;
  }

  preload() {
    this.load.image('blood', blood);
    this.load.image('first_aid', firstAid);

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
    this.load.audio('reload', reload);
    this.load.audio('top', top);
  }

  create() {
    this.input.setDefaultCursor(`url(${cursor}), auto`);

    this.createSound();
    this.setMusic();
    const mapProperties = this.createMap();
    const { widthInPixels, heightInPixels } = mapProperties.map;
    const { layer2 } = mapProperties;

    this.createInstances(mapProperties);
    this.createHotKeys();
    this.createEvents();

    // collisions
    this.physics.add.collider(this.player, layer2, null, null, this);
    this.physics.add.collider(this.zombies, layer2, null, null, this);
    this.physicsEvent.setCollide(this.zombies, this.laserGroup);

    // camera settings
    this.cameras.main.setBounds(0, 0,
      widthInPixels, heightInPixels);
    this.cameras.main.startFollow(this.player);
  }

  createSound() {
    this.soundShoot = this.sound.add('shoot');
    this.soundKnifeAttack = this.sound.add('khife_attack');
    this.reloadSound = this.sound.add('reload');
    this.topSound = this.sound.add('top');
  }

  createMap() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('terrain', 'tilesets', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0).setDepth(-1);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer2.setCollisionByProperty({
      collides: true,
    });

    return {
      map, layer2,
    };
  }

  createEvents() {
    this.pointer = {
      x: -230,
      y: -30,
    };
    const { anim } = this.player;
    this.input.on('pointermove', (pointer) => {
      this.pointer.x = pointer.x;
      this.pointer.y = pointer.y;
    });

    this.input.on('pointerup', (pointer) => {
      this._shootLaser(pointer);
      if (anim === WEAPON.RIFLE) this.player.state = PLAYER_STATE.IDLE;
    });

    this.input.on('pointerdown', (pointer) => {
      this.fireDelta = 0;
      if (anim === WEAPON.KNIFE && this.player.state !== PLAYER_STATE.ATTACK) {
        setTimeout(() => this.soundKnifeAttack.play(), 500);
      }
      this.player.state = PLAYER_STATE.ATTACK;
      this.pointMouse = pointer;
    });
  }

  newZombie(x = 100, y = 200, type = ZOMBIE_TYPE.TYPE_1) {
    this.zombie = new Zombie({
      scene: this,
      x,
      y,
      type,
    },
    this.player);
    return this.zombie;
  }

  createInstances(mapProperties) {
    const { widthInPixels, heightInPixels } = mapProperties.map;
    this.player = new Hero({
      scene: this,
      x: widthInPixels / 2,
      y: heightInPixels / 2,
    });

    this.newZombie();
    this.zombies = this.physics.add.group();
    this.zombies.add(this.zombie);

    this.laserGroup = new LaserGroup(this);
    this.fireGroup = new FireGroup(this);
    this.physicsEvent = new Physics(this, mapProperties.map);

    this.knifeBounds = this.physics.add.image(-100, -100);
  }

  createHotKeys() {
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
  }

  delBulletFromAmmo(gun, pointer) {
    this.laserGroup.magazine[`${gun}`] -= 1;
    if (this.laserGroup.magazine[`${gun}`] === 0
    && this.laserGroup.magazine[`${gun}All`] > 0) {
      this.reload();
    }
    this.soundShoot.play();
    this.fireGroup.fireLaser(this.player, pointer);
  }

  fire(gun, pointer) {
    this.laserGroup.fireLaser(this.player, pointer);
    this.delBulletFromAmmo(gun, pointer);
  }

  _shotgunFire(pointer) {
    for (let i = 0; i < 6; i++) {
      this.laserGroup.fireLaser(
        this.player,
        { x: pointer.x + i * 10, y: pointer.y + i * 10 },
      );
    }
  }

  _shootLaser(pointer, delta) {
    const { anim } = this.player;
    const { textureFrame } = this.player.anims.currentFrame;
    const {
      shotgun, rifle, handgun, shotgunAll, rifleAll,
    } = this.laserGroup.magazine;

    if (anim === WEAPON.KNIFE) {
      if (!this.knifeBounds.body) {
        this.knifeBounds = this.physics.add.image(-100, -100);
      }
      this.physicsEvent.killZombieWithKnife();

      const endKnifeAnim = textureFrame === 'survivor-meleeattack_knife_12'
|| textureFrame === 'survivor-meleeattack_knife_13'
|| textureFrame === 'survivor-meleeattack_knife_14';

      if (endKnifeAnim) {
        this.knifeBounds.destroy();
        this.player.state = PLAYER_STATE.IDLE;
      }
    } else {
      const shotgunFire = anim === WEAPON.SHOTGUN && shotgun !== 0 && shotgunAll > -1;
      const rifleFire = anim === WEAPON.RIFLE && rifle !== 0 && rifleAll > -1;
      const handgunFire = anim === WEAPON.HANDGUN && handgun !== 0;
      if (shotgunFire) {
        this._shotgunFire(pointer);
        this.delBulletFromAmmo(anim, pointer);
      // eslint-disable-next-line no-mixed-operators
      }
      if (handgunFire) {
        this.fire(anim, pointer);
      }
      if (rifleFire) {
        this.fire(anim, pointer);
      }

      this.fireDelta = 0;
      if (anim !== WEAPON.RIFLE) this.player.state = PLAYER_STATE.IDLE;
    }
  }

  reload() {
    this.reloadSound.play();
    this.laserGroup.reload(this.player.anim);
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

  createFirstAid(posX, posY) {
    this.firstAid = this.physics.add.image(posX, posY, 'first_aid').setScale(0.03);
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
        const zombie = this.zombies.getChildren()[i];
        this.physicsEvent.accellerateTo(zombie, this.player);
      }
    }
  }

  setMusic() {
    this.gameMusic = this.sound.add('game-music');
    this.gameMusic.setVolume(0.2);
    this.gameMusic.play();
    this.gameMusic.setLoop(true);
  }
}
