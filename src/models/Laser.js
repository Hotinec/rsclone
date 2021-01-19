/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
import Phaser from 'phaser';
import laser from '../assets/weapon/laser.png';
import fire from '../assets/weapon/flash-1.png';

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

  fire(x, y, mouseX, mouseY) {
    this.body.reset(x, y);
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
      rifle: 30,
      rifleAll: 30,
    };
  }

  fireLaser(x, y, mouseX, mouseY) {
    const laser = this.getFirstDead(true, x, y, 'laser');
    if (laser) {
      laser.fire(x, y, mouseX, mouseY);
    }
  }

  reload(weapon) {
    if (weapon === 'rifle') {
      setTimeout(() => {
        this.magazine.rifle = 30;
        this.magazine.rifleAll -= 30;
      }, 1000);
    } else if (weapon === 'shotgun') {
      setTimeout(() => {
        this.magazine.shotgun = 6;
        this.magazine.shotgunAll -= 6;
      }, 1000);
    } else {
      setTimeout(() => {
        this.magazine.handgun = 10;
      }, 1000);
    }
    this.scene.player.isReload = true;
  }
}

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

  fire(x, y, mouseX, mouseY) {
    this.body.reset(x, y);
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
      key: 'fire',
    });
  }

  fireLaser(x, y, mouseX, mouseY) {
    const fire = this.getFirstDead(false);
    if (fire) {
      fire.fire(x, y, mouseX, mouseY);
    }
  }
}
