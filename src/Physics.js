/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import Phaser from 'phaser';
import { ZOMBIE_TYPE, WEAPON } from './constants';
import { weaponProperties } from './properties';

export class Physics {
  constructor(scene, map) {
    this.scene = scene;
    this.zombie = this.scene.zombie;
    this.player = this.scene.player;
    this.weapon = this.scene.weapon;
    this.map = map;
  }

  setCollide(zombies, bullets) {
    this.scene.physics.add.collider(zombies, zombies, (zomb) => {
      zomb.setVelocityY(this.player.body.y);
      zomb.setVelocityX(this.player.body.x);
    });
    this.destroyZombie(zombies);
    this.shootZombie(zombies, bullets);
  }

  shootZombie(zombies, bullets) {
    this.scene.physics.add.collider(bullets, zombies, (bullet, zombie) => {
      zombie.hp--;
      bullet.destroy();

      this._showBlood(zombie);

      this.scene.laserGroup.getChildren().forEach((item) => {
        item.setActive(false);
        item.setVisible(false);
      });

      this._generateZombies(zombies);
    });
  }

  destroyZombie(zombies) {
    let x = true;

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    this.scene.physics.add.collider(this.player, zombies, (player, zombie) => {
      if (!zombie.isAttack) {
        zombie.isAttack = true;
        player.hp--;
        zombie.body.stop();
        x = false;

        delay(700).then(() => {
          x = true;
        });
      }
    });
  }

  accellerateTo(object1, object2) {
    this.scene.physics.accelerateToObject(object1, object2, 40, 40, 40);
    object1.update(this.scene.pointer);
  }

  killZombieWithKnife() {
    const { zombies } = this.scene;
    const knife = this.scene.knifeBounds;
    const zombiesArr = zombies.getChildren();

    knife.body.setCircle(45);
    knife.setDebugBodyColor(0xffff00);

    this._checkKnifeZombieIntersection(zombiesArr, knife);

    const playerVelocity = this.player.body.velocity;
    knife.body.velocity.copy(playerVelocity);

    const centerBodyOnXY = (a, x, y) => {
      a.position.set(
        x - a.halfWidth,
        y - a.halfHeight,
      );
    };
    const centerBodyOnPoint = (a, p) => {
      centerBodyOnXY(a, p.x, p.y);
    };
    centerBodyOnXY(knife.body, this.player.body.x + 60, this.player.body.y + 35);

    this.player.body.updateCenter();
    knife.body.updateCenter();

    const { RotateAround } = Phaser.Math;
    RotateAround(
      knife.body.center,
      this.player.body.center.x,
      this.player.body.center.y,
      this.player.rotation,
    );

    centerBodyOnPoint(knife.body, knife.body.center);

    this._generateZombies(zombies);
  }

  _checkKnifeZombieIntersection(zombiesArr, knife) {
    for (let i = 0; i < zombiesArr.length; i++) {
      const zombieBounds = zombiesArr[i].getBounds();
      const intersection = Phaser.Geom.Intersects.RectangleToRectangle;

      if ((intersection(knife.getBounds(), zombieBounds))) {
        const zombie = zombiesArr[i];
        zombie.hp = 0;
        this._showBlood(zombie);
      }
    }
  }

  _checkWeapon(zombie) {
    switch (this.scene.score) {
      case 1:
        this._showWeapon(zombie, WEAPON.HANDGUN);
        break;
      case 10:
        this._showWeapon(zombie, WEAPON.SHOTGUN);
        break;
      case 30:
        this._showWeapon(zombie, WEAPON.RIFLE);
        break;
    }
  }

  _generateZombies(zombies) {
    let x;
    if (this.player.x < this.map.widthInPixels / 2) {
      x = Phaser.Math.Between(this.player.x + this.scene.game.config.width, this.map.widthInPixels);
    } else {
      x = Phaser.Math.Between(
        0, this.map.widthInPixels - (this.player.x + this.scene.game.config.width / 2),
      );
    }

    let y = Phaser.Math.Between(0, this.scene.game.config.height);
    if (zombies.getChildren().length < 30) {
      for (let i = 0; i < 2; i++) {
        const type = zombies.getChildren().length % 5 === 0
          ? ZOMBIE_TYPE.TYPE_2
          : ZOMBIE_TYPE.TYPE_1;
        zombies.add(this.scene.newZombie(x, y, type));
        y += 200;
        x += 200;
      }
    }
  }

  _showWeapon(zombie, weapon) {
    if (!this.player.weapon.includes(weapon)) {
      this.scene.createWeapon(zombie.x, zombie.y, weapon);
      this.scene.physics.add.collider(this.player, this.scene.weapon, (player, currWeapon) => {
        currWeapon.destroy();
        this.player.changeWeapon(weapon);
      });
      this.player.weapon.push(weapon);
    }
  }

  _showBlood(zombie) {
    if (zombie.hp === 0) {
      this._checkWeapon(zombie);
      this._showAmmo(zombie);
      this._showFirstAid(zombie);
      zombie.destroy();
      const bloodImg = this.scene.add.image(zombie.x, zombie.y, 'blood').setScale(0.2);
      bloodImg.depth = -1;
      this.scene.score++;
    }
  }

  _showAmmo(zombie) {
    if (this.scene.score % 14 === 0) {
      if (this.player.weapon.includes(WEAPON.HANDGUN)) {
        this._addAmmoCollider(WEAPON.HANDGUN, zombie);
      }
    } else if (this.scene.score % 3 === 0 && this.scene.score % 7 !== 0) {
      if (this.player.weapon.includes(WEAPON.SHOTGUN)) {
        this._addAmmoCollider(WEAPON.SHOTGUN, zombie);
      }
    } else if (this.scene.score % 5 === 0 && this.scene.score % 10 !== 0) {
      if (this.player.weapon.includes(WEAPON.RIFLE)) {
        this._addAmmoCollider(WEAPON.RIFLE, zombie);
      }
    }
  }

  _addAmmoCollider(weapon, zombie) {
    this.scene.createAmmo(zombie.x, zombie.y, `${weapon}Ammo`);
    this.scene.physics.add.collider(this.player, this.scene.ammo, (player, ammo) => {
      this.scene.laserGroup.magazine[`${weapon}All`] += weaponProperties[weapon].magazine;
      if (this.scene.laserGroup.magazine[weapon] === 0) this.scene.reload();
      ammo.destroy();
    });
  }

  _showFirstAid(zombie) {
    if (this.scene.score % 21 === 0) {
      this.scene.createFirstAid(zombie.x, zombie.y);
      this.scene.physics.add.collider(this.player, this.scene.firstAid, (player, firstAid) => {
        player.hp = 10;
        firstAid.destroy();
      });
    }
  }
}
