import Phaser from 'phaser';
import  knife from '../assets/player/body/knife/knife.png';
import knifeAtlas from '../assets/player/body/knife/knife_atlas.json';
import knifeAnim from '../assets/player/body/knife/knife_anim.json';
import handgun from '../assets/player/body/handgun/handgun.png';
import handgunAtlas from '../assets/player/body/handgun/handgun_atlas.json';
import handgunAnim from '../assets/player/body/handgun/handgun_anim.json';


export class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(data) {
    let {scene, x, y, texture, frame} = data;
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);

    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(0.4);
    scene.physics.world.enableBody(this);
    this.setImmovable(true);

    this.hp = 10;
    this.isAttack = false;
  }

  static preload(scene) {
    // knife
    scene.load.atlas('knife', knife, knifeAtlas);
    scene.load.animation('knife_anim', knifeAnim);
    //handgun
    scene.load.atlas('handgun', handgun, handgunAtlas);
    scene.load.animation('handgun_anim', handgunAnim);
  }

  get velocity() {
    return this.body.velocity;
  }

  update(pointer) {
    const speed = 250;
    let playerVelocity = new Phaser.Math.Vector2();
    
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    } 
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }

    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);
  
    if (this.isAttack) {
      this.anims.play('handgun_shoot', true);
    
      if (this.anims.currentFrame.textureFrame === 'survivor-shoot_handgun_2'){
        this.isAttack = false;
      }
    } else {
      if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
        this.anims.play('handgun_move', true);
      } else {
        this.anims.play('handgun_idle', true);
      }
    }
    
    this.setRotation(
      Phaser.Math.Angle.Between(
        this.x, this.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY));
  }
}
