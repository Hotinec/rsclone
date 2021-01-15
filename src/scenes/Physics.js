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
    this.zombie.setBounce(1, 1).setCollideWorldBounds(false).setMass(100);
    this.player.setBounce(1, 1).setCollideWorldBounds(false).setMass(100);
    this.destroyZombie(zombies);
    this.shootZombie(zombies, bullets);
    this.takeWeapon();
  }

  shootZombie(zombies, bullets) {
    this.scene.physics.add.collider(this.scene.laserGroup, zombies, (player, zombie) => {
      zombie.body.stop();
      zombie.destroy();
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

  destroyZombie(zombies) {
    this.scene.physics.add.collider(this.player, zombies, (player, zombie) => {
			if (!zombie.isAttack) {
				zombie.isAttack = true;
				player.hp--;
				zombie.body.stop();
      }
    });
  }

  takeWeapon() {
    this.scene.physics.add.collider(this.player, this.weapon, (player, weapon) => {
      weapon.destroy();
    });
  }

  accellerateTo(object1, object2) {
    this.scene.physics.accelerateToObject(object1, object2, 40, 40, 40);
    object1.update(this.scene.pointer);
  }
}
