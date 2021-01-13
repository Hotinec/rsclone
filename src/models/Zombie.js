import Phaser from 'phaser';
import townMaleAtlas from '../assets/zombie/zombie_atlas.json';
import townMale from '../assets/zombie/zombie.png';
import maleAnim from '../assets/zombie/zombie_anim.json';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(data) {
    let {scene, x, y, texture, frame} = data;
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);

    // this.scale = 0.5;

    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(0.5);
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
    //const speed = 100;
    let playerVelocity = new Phaser.Math.Vector2();
    
    // if (this.inputKeys.left.isDown) {
    //   playerVelocity.x = -1;
    // } else if (this.inputKeys.right.isDown) {
    //   playerVelocity.x = 1;
    // } 
    // if (this.inputKeys.up.isDown) {
    //   playerVelocity.y = -1;
    // } else if (this.inputKeys.down.isDown) {
    //   playerVelocity.y = 1;
    // }

    playerVelocity.normalize();
    //playerVelocity.scale(speed);
    //this.setVelocity(playerVelocity.x, playerVelocity.y);
  
  //  if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
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