/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import fire from '../assets/weapon/flash-1.png';
import { WEAPON } from '../constants';
import { IPointer } from './IPointer';
import { Hero } from './Hero';

export class Fire extends Phaser.Physics.Arcade.Sprite {
  incY: number;

  incX: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'fire');
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    setTimeout(() => {
      this.setActive(false);
      this.setVisible(false);
    }, 10);
  }

  static preload(scene: Phaser.Scene): void {
    scene.load.image('fire', fire);
  }

  fire({
    x, y, rotation, anim,
  }: Hero, { x: mouseX, y: mouseY }: IPointer): void {
    const rotationCos = Math.cos(rotation);
    const rotationSin = Math.sin(rotation);

    const objectPositionTmp = {
      x: x + 15, y: y + 17,
    };
    if (anim === WEAPON.SHOTGUN) {
      objectPositionTmp.x = x + 25;
    }
    if (anim === WEAPON.RIFLE) {
      objectPositionTmp.x = x + 30;
    }

    const templateX = objectPositionTmp.x - x;
    const templateY = objectPositionTmp.y - y;

    const newX = templateX * rotationCos - templateY * rotationSin + x;
    const newY = templateY * rotationSin + templateX * rotationCos + y;
    this.body.reset(newX, newY);
    this.setActive(true);
    this.scale = 0.5;
    this.setVisible(true);
    const { scrollX, scrollY } = this.scene.cameras.main;
    const angle = Phaser.Math.Angle.Between(
      x, y, mouseX + scrollX, mouseY + scrollY,
    );
    this.setRotation(angle);
    this.incX = Math.cos(angle);
    this.incY = Math.sin(angle);
    this.setVelocity(this.incX, this.incY);
  }
}

export class FireGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Fire,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: 'fire',
    });
  }

  fireLaser(player: Hero, mouse: IPointer): void {
    const fire = this.getFirstDead(false);
    if (fire) {
      fire.fire(player, mouse);
    }
  }
}
