import Phaser from 'phaser';
import pistolAmmo from '../assets/weapon/handgun_bullet.png';
import rifleAmmo from '../assets/weapon/rifle_bullet.png';
import shotgunAmmo from '../assets/weapon/shotgun_bullet.png';

export class Ammo extends Phaser.Physics.Arcade.Sprite {
  constructor(data) {
    const {
      scene, x, y, texture,
    } = data;
    super(scene, x, y, texture);
    this.scene.add.existing(this);
    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(0.5);
    scene.physics.world.enableBody(this);
    this.setImmovable(false);
  }

  static preload(scene) {
    scene.load.image('pistolAmmo', pistolAmmo);
    scene.load.image('rifleAmmo', rifleAmmo);
    scene.load.image('shotgunAmmo', shotgunAmmo);
  }

  update() {
    this.rotation += 0.01;
  }
}
