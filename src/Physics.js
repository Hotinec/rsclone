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
    this.takeWeapon();
  }

  shootZombie(zombies, bullets) {
    this.scene.physics.add.collider(bullets, zombies, (bullet, zombie) => {
      // zombie.body.stop();
      zombie.hp--;
      bullet.destroy();

      if (zombie.hp === 0) {
        zombie.destroy();
      }

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

  takeWeapon() {
    this.scene.physics.add.collider(this.player, this.weapon, (player, weapon) => {
      weapon.destroy();
    });
  }

  accellerateTo(object1, object2) {
    this.scene.physics.accelerateToObject(object1, object2, 40, 40, 40);
    object1.update(this.scene.pointer);
  }

  killZombieWithKnife(){
    const zombies = this.scene.zombies;
    const knife = this.scene.knifeBounds;
    const zombiesArr = zombies.getChildren()

    knife.body.setCircle(45)
    knife.setDebugBodyColor(0xffff00);

    for(let i = 0; i < zombiesArr.length; i++){
      const zombieBounds = zombiesArr[i].getBounds()
      const intersection = Phaser.Geom.Intersects.RectangleToRectangle;

      if((intersection(knife.getBounds(), zombieBounds))){
        zombiesArr[i].destroy();
      }
    }

    const v = this.player.body.velocity;
      knife.body.velocity.copy(v);

      const centerBodyOnXY = (a, x, y) => {
        a.position.set(
          x - a.halfWidth,
          y - a.halfHeight
        );
      }
      const centerBodyOnPoint = (a, p) => {
        centerBodyOnXY(a, p.x, p.y);
      }
      centerBodyOnXY(knife.body, this.player.body.x + 60, this.player.body.y + 35);
  
      this.player.body.updateCenter();
      knife.body.updateCenter();
  
      const RotateAround = Phaser.Math.RotateAround;
      RotateAround(knife.body.center, this.player.body.center.x, this.player.body.center.y, this.player.rotation);
  
      centerBodyOnPoint(knife.body, knife.body.center);
      knife.body.velocity.copy(this.player.body.velocity);
      // need to add zombies generation

  }
}
