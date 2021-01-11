import Phaser from 'phaser';
import feet from '../assets/player/feet/feet.png';
import feetAtlas from '../assets/player/feet/feet_atlas.json';
import feetAnim from '../assets/player/feet/feet_anim.json';
import  knife from '../assets/player/body/knife/knife.png';
import knifeAtlas from '../assets/player/body/knife/knife_atlas.json';
import knifeAnim from '../assets/player/body/knife/knife_anim.json';

export class Player {
  constructor(scene) {
    this.scene = scene;

    console.log(this.scene)

    this.body = this.scene.physics.add.sprite(0, 0, 'body_knife');
    this.feet = this.scene.physics.add.sprite(0, 0, 'feet');

    this.player = this.scene.add.container(
      this.scene.game.config.width / 2, 
      this.scene.game.config.height / 2, 
      [this.feet, this.body]
    ).setDepth(1).setScale(0.5);
  }

  static preload(scene) {
    scene.load.atlas('feet', feet, feetAtlas);
    scene.load.animation('feet_anim', feetAnim);
    scene.load.atlas('body_knife', knife, knifeAtlas);
    scene.load.animation('knife_anim', knifeAnim);
  }

  get velocity() {
    return this.body.velocity;
  }

  update(pointer) {
    const speed = 128;
    let playerVelocity = new Phaser.Math.Vector2();
    
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = 1;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = -1;
    } 
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = 1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = -1;
    }

    playerVelocity.normalize();
    playerVelocity.scale(speed);

    this.feet.setVelocity(playerVelocity.x, playerVelocity.y);
    this.body.setVelocity(playerVelocity.x, playerVelocity.y);
  
    if (Math.abs(playerVelocity.x) > 0.1 || Math.abs(playerVelocity.y) > 0.1) {
      this.feet.anims.play('run', true);
      // this.body.anims.play('knife_move', true);
    } else {
      this.feet.anims.play('idle', true);
      // this.body.anims.play('knife_idle', true);
    }

    this.player.setRotation(
      Phaser.Math.Angle.Between(
        this.player.x, 
        this.player.y, 
        pointer.x + this.scene.cameras.main.scrollX, 
        pointer.y + this.scene.cameras.main.scrollY
      ));
  }
}