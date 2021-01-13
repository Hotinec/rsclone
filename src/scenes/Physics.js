import Phaser from 'phaser';
export class Physics {
    constructor(scene) {
        this.scene = scene;
        this.zombie = this.scene.zombie;
        this.player = this.scene.player;
        this.weapon = this.scene.weapon;
    }

    setCollide(zombies) {
        this.zombie.setBounce(1, 1).setCollideWorldBounds(true).setMass(100);
        this.player.setBounce(1, 1).setCollideWorldBounds(true).setMass(100);
        this.destroyZombie(zombies);
        this.takeWeapon();
    }

    destroyZombie(zombies) {
        this.scene.physics.add.collider(this.player, zombies, (player, zombie) => {
            zombie.body.stop();
            zombie.destroy();

            const x = Phaser.Math.Between(0, this.scene.game.config.width);
            const y = Phaser.Math.Between(0, this.scene.game.config.height);
            if (zombies.getChildren().length < 30) {
                for (let i = 0; i < 2; i++) {
                    zombies.add(this.scene.newZombie(x, y));
                }
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