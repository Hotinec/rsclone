/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import fire from '../assets/weapon/flash-1.png';

export class Fire extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fire');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    setTimeout(() => {
      this.setActive(false);
      this.setVisible(false);
    }, 10);
  }

  static preload(scene) {
    scene.load.image('fire', fire);
  }

  fire({
    x, y, rotation, anim,
  }, { x: mouseX, y: mouseY }) {
    const rotationCos = Math.cos(rotation);
    const rotationSin = Math.sin(rotation);

    const objectPositionTmp = {
      x: x + 15, y: y + 17,
    };
    if (anim === 'shotgun') {
      objectPositionTmp.x = x + 25;
    }
    if (anim === 'rifle') {
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
    const angle = Phaser.Math.Angle.Between(
      x, y, mouseX + this.scene.cameras.main.scrollX, mouseY + this.scene.cameras.main.scrollY,
    );
    this.setRotation(angle);
    this.incX = Math.cos(angle);
    this.incY = Math.sin(angle);
    this.setVelocity(this.incX, this.incY);
  }
}

export class FireGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Fire,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: 'fire',
    });
  }

  fireLaser(player, mouse) {
    const fire = this.getFirstDead(false);
    if (fire) {
      fire.fire(player, mouse);
    }
  }
}
