import Phaser from 'phaser';
import pistol from '../assets/weapon/pistol.png';
import rifle from '../assets/weapon/rifle.png';
import shotgun from '../assets/weapon/shotgun.png';

export class Weapon extends Phaser.Physics.Arcade.Sprite {
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
    scene.load.image('handgun', pistol);
    scene.load.image('rifle', rifle);
    scene.load.image('shotgun', shotgun);
  }

  get velocity() {
    return this.body.velocity;
  }

  update() {
    this.rotation += 0.01;
  }
}
