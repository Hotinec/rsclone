import Phaser from 'phaser';

import {
  PLAYER_STATE, ZOMBIE_TYPE, WEAPON, THEME,
} from '../constants';
import cursor from '../assets/cursor.cur';

import {
  Zombie, Hero, Weapon, LaserGroup, FireGroup, Ammo,
} from '../models';
import { Physics } from '../Physics';
import { IPointer } from '../models/IPointer';
import { DarkMode } from '../DarkMode';

import { weaponProperties } from '../properties';

export class GameScene extends Phaser.Scene {
  weapon: Weapon | null;

  score: number;

  player: Hero;

  physicsEvent: Physics;

  pointer: IPointer;

  pointMouse: IPointer;

  zombie: Zombie;

  zombies: Phaser.Physics.Arcade.Group;

  fireDelta: number;

  laserGroup: LaserGroup;

  fireGroup: FireGroup;

  knifeBounds: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  soundShoot: Phaser.Sound.BaseSound;

  soundKnifeAttack: Phaser.Sound.BaseSound;

  reloadSound: Phaser.Sound.BaseSound;

  topSound: Phaser.Sound.BaseSound;

  ammo: Ammo;

  firstAid: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  mode: string;

  darkMode: DarkMode;

  gameMusic: Phaser.Sound.BaseSound;

  zombieCry: Phaser.Sound.BaseSound;

  constructor() {
    super('GameScene');

    this.weapon = null;
    this.score = 0;
    this.mode = THEME.BLACK;

    this.darkMode = new DarkMode();
  }

  init(mode: string): void {
    this.mode = mode;
    this.score = 0;
  }

  create(): void {
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
    this.physics.add.collider(this.player, layer2, undefined, undefined, this);
    this.physics.add.collider(this.zombies, layer2, undefined, undefined, this);
    this.physicsEvent.setCollide(this.zombies, this.laserGroup);

    // camera settings
    this.cameras.main.setBounds(0, 0,
      widthInPixels, heightInPixels);
    this.cameras.main.startFollow(this.player);
  }

  createSound(): void {
    this.soundShoot = this.sound.add('shoot');
    this.soundKnifeAttack = this.sound.add('khife_attack');
    this.reloadSound = this.sound.add('reload');
    this.topSound = this.sound.add('top');
    this.zombieCry = this.sound.add('cry');
  }

  createMap(): {map: Phaser.Tilemaps.Tilemap; layer2: Phaser.Tilemaps.TilemapLayer} {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('terrain', 'tilesets', 32, 32, 0, 0);
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0).setDepth(-1);
    const layer2 = map.createLayer('Tile Layer 2', tileset, 0, 0);
    layer2.setCollisionByProperty({
      collides: true,
    });

    if (this.mode === THEME.BLACK) {
      this.darkMode.darking(this, layer1, layer2);
    }

    return {
      map, layer2,
    };
  }

  createEvents(): void {
    this.pointer = {
      x: -230,
      y: -30,
    };

    this.input.on('pointermove', (pointer: IPointer) => {
      this.pointer.x = pointer.x;
      this.pointer.y = pointer.y;
    });

    this.input.on('pointerup', (pointer: IPointer) => {
      this._shootLaser(pointer);
      if (this.player.anim === WEAPON.RIFLE
        && this.player.state !== PLAYER_STATE.RELOAD) this.player.state = PLAYER_STATE.IDLE;
    });

    this.input.on('pointerdown', (pointer: IPointer) => {
      this.fireDelta = 0;
      if (this.player.anim === WEAPON.KNIFE && this.player.state !== PLAYER_STATE.ATTACK) {
        setTimeout(() => this.soundKnifeAttack.play(), 500);
      }
      if (this.player.state !== PLAYER_STATE.RELOAD) this.player.state = PLAYER_STATE.ATTACK;
      this.pointMouse = pointer;
    });
  }

  newZombie(x = 100, y = 200, type = ZOMBIE_TYPE.TYPE_1): Zombie {
    this.zombie = new Zombie({
      scene: this,
      x,
      y,
      type,
    },
    this.player);

    if (this.mode === THEME.BLACK) {
      this.darkMode.setDarkObject(this.zombie);
    }

    return this.zombie;
  }

  createInstances(mapProperties: {
    map: Phaser.Tilemaps.Tilemap;
    layer2: Phaser.Tilemaps.TilemapLayer;
  }): void {
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

    // @ts-ignore
    this.knifeBounds = this.physics.add.image(-100, -100);
  }

  createHotKeys(): void {
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

  delBulletFromAmmo(gun: string, pointer: IPointer): void {
    this.laserGroup.magazine[`${gun}`] -= 1;

    if (this.laserGroup.magazine[`${gun}`] === 0
    && this.laserGroup.magazine[`${gun}All`] > 0) {
      this.reload();
    }
    this.soundShoot.play();
    this.fireGroup.fireLaser(this.player, pointer);
  }

  fire(gun: string, pointer: IPointer): void {
    this.laserGroup.fireLaser(this.player, pointer);
    this.delBulletFromAmmo(gun, pointer);
  }

  _shotgunFire(pointer: IPointer): void {
    for (let i = 0; i < 6; i++) {
      this.laserGroup.fireLaser(
        this.player,
        { x: pointer.x + i * 10, y: pointer.y + i * 10 },
      );
    }
  }

  _shootLaser(pointer: IPointer): void {
    const { anim } = this.player;
    const { textureFrame } = this.player.anims.currentFrame;
    const {
      shotgun, rifle, handgun, shotgunAll, rifleAll, handgunAll,
    } = this.laserGroup.magazine;

    if (anim === WEAPON.KNIFE) {
      const frameNum = +String(textureFrame).slice(-2) || +String(textureFrame).slice(-1);
      if (frameNum > 5) {
        if (!this.knifeBounds.body) {
          // @ts-ignore
          this.knifeBounds = this.physics.add.image(-100, -100);
        }
        this.physicsEvent.killZombieWithKnife();
      }

      const { endFrame } = weaponProperties.knife;
      const endKnifeAnim = endFrame?.some((frame) => frame === textureFrame);

      if (endKnifeAnim) {
        this.knifeBounds.destroy();
        this.player.state = PLAYER_STATE.IDLE;
      }
    } else {
      if (this.player.state !== PLAYER_STATE.RELOAD) {
        const handgunIsEmpty = anim === WEAPON.HANDGUN && handgun === 0 && handgunAll > 0;
        const shotgunIsEmpty = anim === WEAPON.SHOTGUN && shotgun === 0 && shotgunAll > 0;
        const rifleIsEmpty = anim === WEAPON.RIFLE && rifle === 0 && rifleAll > 0;
        if (handgunIsEmpty) this.reload();
        if (shotgunIsEmpty) this.reload();
        if (rifleIsEmpty) this.reload();
      }

      const shotgunFire = anim === WEAPON.SHOTGUN && shotgun !== 0 && shotgunAll > -1;
      const rifleFire = anim === WEAPON.RIFLE && rifle !== 0 && rifleAll > -1;
      const handgunFire = anim === WEAPON.HANDGUN && handgun !== 0;
      if (shotgunFire) {
        this._shotgunFire(pointer);
        this.fire(anim, pointer);
      }
      if (handgunFire) {
        this.fire(anim, pointer);
      }
      if (rifleFire) {
        this.fire(anim, pointer);
      }

      this.fireDelta = 0;
      if (anim !== WEAPON.RIFLE
        && this.player.state !== PLAYER_STATE.RELOAD) this.player.state = PLAYER_STATE.IDLE;
    }
  }

  reload(): void {
    this.reloadSound.play();
    this.laserGroup.reload(this.player.anim);
  }

  createWeapon(posX: number, posY: number, texture: string): void {
    this.weapon = new Weapon({
      scene: this,
      x: posX,
      y: posY,
      texture,
    });
    if (this.mode === THEME.BLACK) {
      this.darkMode.setDarkObject(this.weapon);
    }
  }

  createAmmo(posX: number, posY: number, texture: string): void {
    this.ammo = new Ammo({
      scene: this,
      x: posX,
      y: posY,
      texture,
    });
    if (this.mode === THEME.BLACK) {
      this.darkMode.setDarkObject(this.ammo);
    }
  }

  createFirstAid(posX: number, posY: number): void {
    this.firstAid = this.physics.add.image(posX, posY, 'first_aid').setScale(0.03);
    if (this.mode === THEME.BLACK) {
      this.darkMode.setDarkObject(this.firstAid);
    }
  }

  update(): void {
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

  setMusic(): void {
    const menu = this.scene.get('MenuScene');

    this.gameMusic = this.sound.add('game-music');
    // @ts-ignore
    this.gameMusic.setVolume(0.2);
    // @ts-ignore
    this.gameMusic.setLoop(true);
    // @ts-ignore
    if (menu.soundOn) this.gameMusic.play();
  }
}
