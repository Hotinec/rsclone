import Phaser from 'phaser';
import laser from '../assets/weapon/laser.png';
export class LaserGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Laser,
            frameQuantity: 30,
            active: false,
            key: 'laser',
        })
    }

    fireLaser(x, y, mouseX, mouseY) {
        const laser = this.getFirstDead(false);
        if(laser){
            laser.fire(x, y, mouseX, mouseY);
        }
    }
}

export class Laser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'laser');
    }
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if(this.y <= 0){
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
        this.setVisible(true);
        let angle = Phaser.Math.Angle.Between(mouseX + this.scene.cameras.main.scrollX, mouseY + this.scene.cameras.main.scrollY, x, y);
        this.incX = Math.cos(angle);
        this.incY = Math.sin(angle);
        this.setVelocity(this.incX * -2900, this.incY * -2900);
    }
}
