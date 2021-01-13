import Phaser from 'phaser';
import townMaleAtlas from '../assets/zombie/zombie_atlas.json';
import townMale from '../assets/zombie/zombie.png';
import maleAnim from '../assets/zombie/zombie_anim.json';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(data) {
    let {scene, x, y, texture, frame} = data;
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);

    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(0.4);
    scene.physics.world.enableBody(this);
    this.setImmovable(false);
    this.hp = 10;

    this.isAttack = false;
  }

  static preload(scene) {
    scene.load.atlas(
      'zombie',
      townMale,
      townMaleAtlas
    );
    scene.load.animation('zombie_anim', maleAnim);
  }

  get velocity() {
    return this.body.velocity;
  }

  update(pointer) {
    let playerVelocity = new Phaser.Math.Vector2();
    playerVelocity.normalize();

    if(this.isAttack){
       this.anims.play('zombie_idle', true);      
    } else {
      this.anims.play('zombie_move', true);
    }

    this.setRotation(
      Phaser.Math.Angle.Between(
        this.x, this.y, this.scene.player.x + this.scene.cameras.main.scrollX, this.scene.player.y + this.scene.cameras.main.scrollY));
  }
}