/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import laser from '../assets/weapon/laser.png';

export class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'laser');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  static preload(scene) {
    scene.load.image('laser', laser);
  }

  fire({
    x, y, rotation, anim,
  }, { x: mouseX, y: mouseY }) {
    const rotationCos = Math.cos(rotation);
    const rotationSin = Math.sin(rotation);

    const objectPositionTmp = {
      x: x + 0, y: y + 15,
    };

    if (anim === 'shotgun') {
      objectPositionTmp.x = x + 20;
      objectPositionTmp.y = y + 10;
    }
    if (anim === 'rifle') {
      objectPositionTmp.x = x + 35;
    }

    const templateX = objectPositionTmp.x - x;
    const templateY = objectPositionTmp.y - y;

    const newX = templateX * rotationCos - templateY * rotationSin + x;
    const newY = templateX * rotationSin + templateY * rotationCos + y;
    this.body.reset(newX, newY);

    this.setActive(true);
    this.setOrigin(1);
    this.setVisible(true);
    const angle = Phaser.Math.Angle.Between(
      mouseX + this.scene.cameras.main.scrollX, mouseY + this.scene.cameras.main.scrollY, x, y,
    );
    this.incX = Math.cos(angle);
    this.incY = Math.sin(angle);
    this.setOrigin(4 * this.incX, 4 * this.incY);
    this.setVelocity(this.incX * -1900, this.incY * -1900);
  }
}

export class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Laser,
      frameQuantity: 30,
      active: false,
      key: 'laser',
    });

    this.magazine = {
      shotgun: 6,
      shotgunAll: 6,
      handgun: 10,
      handgunAll: 10,
      rifle: 30,
      rifleAll: 30,
    };
  }

  fireLaser(player, mouse) {
    const laser = this.getFirstDead(true, player.x, player.y, 'laser');
    if (laser) {
      laser.fire(player, mouse);
    }
  }

  reload(weapon) {
    if (weapon === 'handgun') {
      setTimeout(() => {
        this.magazine.handgun = 10;
        this.magazine.handgunAll -= 10;
      }, 1000);
    } else if (weapon === 'rifle') {
      setTimeout(() => {
        this.magazine.rifle = 30;
        this.magazine.rifleAll -= 30;
      }, 1000);
    } else if (weapon === 'shotgun') {
      setTimeout(() => {
        this.magazine.shotgun = 6;
        this.magazine.shotgunAll -= 6;
      }, 1000);
    }

    this.scene.player.isReload = true;
  }
}
