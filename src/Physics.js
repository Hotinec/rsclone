import Phaser from 'phaser';
export class Physics {
  constructor(scene, map) {
    this.scene = scene;
    this.zombie = this.scene.zombie;
    this.player = this.scene.player;
    this.weapon = this.scene.weapon;
    this.map = map;
  }

  setCollide(zombies, bullets) {
    this.scene.physics.add.collider(zombies);
    this.zombie.setBounce(1, 1).setCollideWorldBounds(false).setMass(100);
    this.player.setBounce(1, 1).setCollideWorldBounds(false).setMass(100);
    this.destroyZombie(zombies);
    this.shootZombie(zombies, bullets);
  }

  shootZombie(zombies, bullets) {
    this.scene.physics.add.collider(bullets, zombies, (bullet, zombie) => {
      zombie.hp--;
      bullet.destroy();

      if (zombie.hp === 0) {
        zombie.destroy();
        const blod = this.scene.add.image(zombie.x, zombie.y, 'blod').setScale(0.2);
        blod.depth = -1;
        this.scene.score++;
      }

      this.showWeapon(zombie);

      this.scene.laserGroup.getChildren().forEach((item) => {
          item.setActive(false);
          item.setVisible(false);
      });

       let x;
       if(this.player.x < this.map.widthInPixels / 2){
          x = Phaser.Math.Between(this.player.x + this.scene.game.config.width , this.map.widthInPixels);
       }
       else {
          x = Phaser.Math.Between(0, this.map.widthInPixels - (this.player.x + this.scene.game.config.width / 2 ));
       }
      //const x = Phaser.Math.Between(0, this.scene.game.config.width);
      const y = Phaser.Math.Between(0, this.scene.game.config.height);
      if (zombies.getChildren().length < 30) {
          for (let i = 0; i < 2; i++) {
              zombies.add(this.scene.newZombie(x, y));
          }
      }
    });
  }

  showWeapon(zombie) {
    switch (this.scene.score) {
      case 1:
        if (!this.player.weapon.includes('shotgun')) {
          this.scene.createWeapon(zombie.x, zombie.y, 'shotgun');
          this.scene.physics.add.collider(this.player, this.scene.weapon, (player, weapon) => {
            weapon.destroy();
            this.player.changeWeapon('shotgun-body', 'survivor-idle_shotgun_0', 'shotgun');
          });
          this.player.weapon.push('shotgun');
        }
        break;
      case 10:
        if (!this.player.weapon.includes('rifle')) {
          this.scene.createWeapon(zombie.x, zombie.y, 'rifle');
          this.scene.physics.add.collider(this.player, this.scene.weapon, (player, weapon) => {
            weapon.destroy();
            this.player.changeWeapon('rifle-body', 'survivor-idle_rifle_0', 'rifle');
          });
          this.player.weapon.push('rifle');
        }
    }
  }

  destroyZombie(zombies) {
    let x = true;
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

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  accellerateTo(object1, object2) {
    this.scene.physics.accelerateToObject(object1, object2, 40, 40, 40);
    object1.update(this.scene.pointer);
  }
}
