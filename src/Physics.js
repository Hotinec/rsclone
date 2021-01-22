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
      const { x, y } = this.player.body;
      zomb.setVelocityY(y);
      zomb.setVelocityX(x);
    });
    this.destroyZombie(zombies);
    this.shootZombie(zombies, bullets);
  }

  shootZombie(zombies, bullets) {
    this.scene.physics.add.collider(bullets, zombies, (bullet, zombie) => {
      zombie.hp--;
      bullet.destroy();

      this._showBlood(zombie);

      const laserArray = this.scene.laserGroup.getChildren();

      laserArray.forEach((item) => {
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

    knife.body.setCircle(45);
    knife.setDebugBodyColor(0xffff00);

    this._checkKnifeZombieIntersection(zombies, knife);
    this._setKnifeBoundsPosition(knife);
    this._generateZombies(zombies);
  }

  _checkKnifeZombieIntersection(zombies, knife) {
    this.scene.physics.add.overlap(knife, zombies, (kn, zombie) => {
      zombies.killAndHide(zombie);
      zombie.hp = 0;
      this._showBlood(zombie);
    });
  }

  _setKnifeBoundsPosition(knife) {
    const playerBody = this.player.body;
    const { x: playerX, y: playerY } = playerBody;
    const { velocity: playerVelocity } = playerBody;

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
    centerBodyOnXY(knife.body, playerX + 60, playerY + 35);

    playerBody.updateCenter();
    knife.body.updateCenter();

    const { RotateAround } = Phaser.Math;
    RotateAround(
      knife.body.center,
      playerBody.center.x,
      playerBody.center.y,
      this.player.rotation,
    );

    centerBodyOnPoint(knife.body, knife.body.center);
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
    const { width, height } = this.scene.game.config;
    const { x: playerX } = this.player;
    const mapWidth = this.map.widthInPixels;
    if (this.player.x < mapWidth / 2) {
      x = Phaser.Math.Between(playerX + width, mapWidth);
    } else {
      x = Phaser.Math.Between(
        0, mapWidth - (playerX + width / 2),
      );
    }

    let y = Phaser.Math.Between(0, height);
    const zombiesArray = zombies.getChildren();
    if (zombiesArray.length < 30) {
      for (let i = 0; i < 2; i++) {
        const type = zombiesArray.length % 5 === 0
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
      const { x, y } = zombie;
      this.scene.createWeapon(x, y, weapon);
      this.scene.physics.add.collider(this.player, this.scene.weapon, (player, currWeapon) => {
        currWeapon.destroy();
        this.player.changeWeapon(weapon);
      });
      this.player.weapon.push(weapon);
    }
  }

  _showBlood(zombie) {
    const { x, y, hp } = zombie;
    if (hp === 0) {
      this._checkWeapon(zombie);
      this._showAmmo(zombie);
      this._showFirstAid(zombie);
      zombie.destroy();
      const bloodImg = this.scene.add.image(x, y, 'blood').setScale(0.2);
      bloodImg.depth = -1;
      this.scene.score++;
    }
  }

  _showAmmo(zombie) {
    const { score } = this.scene;
    if (score % 14 === 0) {
      if (this.player.weapon.includes(WEAPON.HANDGUN)) {
        this._addAmmoCollider(WEAPON.HANDGUN, zombie);
      }
    } else if (score % 3 === 0 && score % 7 !== 0) {
      if (this.player.weapon.includes(WEAPON.SHOTGUN)) {
        this._addAmmoCollider(WEAPON.SHOTGUN, zombie);
      }
    } else if (score % 5 === 0 && score % 10 !== 0) {
      if (this.player.weapon.includes(WEAPON.RIFLE)) {
        this._addAmmoCollider(WEAPON.RIFLE, zombie);
      }
    }
  }

  _addAmmoCollider(weapon, zombie) {
    const { x, y } = zombie;
    this.scene.createAmmo(x, y, `${weapon}Ammo`);
    this.scene.physics.add.collider(this.player, this.scene.ammo, (player, ammo) => {
      this.scene.laserGroup.magazine[`${weapon}All`] += weaponProperties[weapon].magazine;
      if (this.scene.laserGroup.magazine[weapon] === 0) this.scene.reload();
      ammo.destroy();
    });
  }

  _showFirstAid(zombie) {
    const { score } = this.scene;
    if (score % 21 === 0 && score !== 0) {
      this.scene.createFirstAid(zombie.x, zombie.y);
      this.scene.physics.add.collider(this.player, this.scene.firstAid, (player, firstAid) => {
        player.hp = 10;
        firstAid.destroy();
      });
    }
  }
}
