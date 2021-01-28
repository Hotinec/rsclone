/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/extensions */
import Phaser from 'phaser';
import knifeImg from '../assets/player/body/knife/knife.png';
import knifeAtlas from '../assets/player/body/knife/knife_atlas.json';
import knifeAnim from '../assets/player/body/knife/knife_anim.json';
import { PLAYER_STATE, WEAPON } from '../constants';
import handgun from '../assets/player/body/handgun/handgun.png';
import handgunAtlas from '../assets/player/body/handgun/handgun_atlas.json';
import handgunAnim from '../assets/player/body/handgun/handgun_anim.json';
import shotgunImg from '../assets/player/body/shotgun/shortgun.png';
import shotgunAtlas from '../assets/player/body/shotgun/shortgun_atlas.json';
import shotgunAnim from '../assets/player/body/shotgun/shortgun_anim.json';
import rifleImg from '../assets/player/body/rifle/rifle.png';
import rifleAtlas from '../assets/player/body/rifle/rifle_atlas.json';
import rifleAnim from '../assets/player/body/rifle/rifle_anim.json';
import { playerProperties, weaponProperties } from '../properties';
import { IPointer } from './IPointer';
import { GameScene } from '../scenes/GameScene';

interface IHero {
  scene: GameScene;
  x: number;
  y: number;
}

export class Hero extends Phaser.Physics.Arcade.Sprite {
  hp: number;

  anim: string;

  weapon: string[];

  isReload: boolean;

  inputKeys: any;

  scene: GameScene;

  constructor(data: IHero) {
    const { scene, x, y } = data;
    const {
      defaultTexture, defaultFrame, circle, hp, scale,
    } = playerProperties;
    super(scene, x, y, defaultTexture, defaultFrame);
    this.scene.add.existing(this);

    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(scale);
    scene.physics.world.enableBody(this);
    this.setImmovable(true);
    this.hp = hp;
    this.setCircle(circle, this.width / 4, this.height / 4);
    this.state = PLAYER_STATE.IDLE;

    this.anim = WEAPON.KNIFE;
    this.weapon = [WEAPON.KNIFE];
    this.isReload = false;
  }

  static preload(scene: Phaser.Scene): void {
    // knife
    scene.load.atlas('knife', knifeImg, knifeAtlas);
    scene.load.animation('knife_anim', knifeAnim);
    // handgun
    scene.load.atlas('handgun-body', handgun, handgunAtlas);
    scene.load.animation('handgun_anim', handgunAnim);
    // shotgun
    scene.load.atlas('shotgun-body', shotgunImg, shotgunAtlas);
    scene.load.animation('shotgun_anim', shotgunAnim);
    // rifle
    scene.load.atlas('rifle-body', rifleImg, rifleAtlas);
    scene.load.animation('rifle_anim', rifleAnim);
  }

  get velocity(): {x: number; y?: number} {
    return this.body.velocity;
  }

  changeWeapon(weapon: string): void {
    const { body, frame } = weaponProperties[weapon];
    const { KNIFE } = WEAPON;
    if (weapon !== this.anim) {
      if (this.anim === KNIFE && weapon !== KNIFE) {
        this.scene.knifeBounds.destroy();
      }
      this.setTexture(body, frame);
      this.anim = weapon;
    }
  }

  _changeAnimation(): void {
    const { x, y } = this.velocity;

    if (this.state === PLAYER_STATE.ATTACK) {
      if (this.anim === WEAPON.KNIFE) {
        this.anims.play('knife_attack', true);
      } else {
        this.anims.play(`${this.anim}_shoot`, true);
      }
    } else if (this.isReload) {
      this.scene.reloadSound.play();
      if (this.anim !== WEAPON.KNIFE) {
        this.anims.play(`${this.anim}_reload`, true);
      }

      const { textureFrame } = this.anims.currentFrame;
      if (textureFrame === `survivor-reload_${this.anim}_10`) {
        this.isReload = false;
      }
      // @ts-ignore
    } else if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
      this.anims.play(`${this.anim}_move`, true);
    } else {
      this.anims.play(`${this.anim}_idle`, true);
    }
  }

  _movePlayer(): void {
    const { speed } = playerProperties;
    const playerVelocity = new Phaser.Math.Vector2();

    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    }

    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }

    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);
  }

  _checkWeapon(): void {
    const {
      knife, pistol, shotgun, rifle,
    } = this.inputKeys;
    if (knife.isDown && this.weapon.includes(WEAPON.KNIFE)) {
      this.changeWeapon(WEAPON.KNIFE);
    } else if (pistol.isDown && this.weapon.includes(WEAPON.HANDGUN)) {
      this.changeWeapon(WEAPON.HANDGUN);
    } else if (shotgun.isDown && this.weapon.includes(WEAPON.SHOTGUN)) {
      this.changeWeapon(WEAPON.SHOTGUN);
    } else if (rifle.isDown && this.weapon.includes(WEAPON.RIFLE)) {
      this.changeWeapon(WEAPON.RIFLE);
    }
  }

  update(pointer: IPointer): void {
    this._checkWeapon();
    this._movePlayer();

    this._changeAnimation();

    this.setRotation(
      Phaser.Math.Angle.Between(
        this.x,
        this.y,
        pointer.x + this.scene.cameras.main.scrollX,
        pointer.y + this.scene.cameras.main.scrollY,
      ),
    );
  }
}
