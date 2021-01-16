import Phaser from 'phaser';
import  knife from '../assets/player/body/knife/knife.png';
import knifeAtlas from '../assets/player/body/knife/knife_atlas.json';
import knifeAnim from '../assets/player/body/knife/knife_anim.json';
import { PLAYER_STATE } from '../constants'


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
    console.log(this);
   
    this.setCircle(70, this.width / 4, this.height / 4);
    this.state = PLAYER_STATE.IDLE;
  }

  static preload(scene) {
    scene.load.atlas('knife', knife, knifeAtlas);
    scene.load.animation('knife_anim', knifeAnim);
    console.log(scene);
  }

  get velocity() {
    return this.body.velocity;
  }

  update(pointer) {
    const speed = 100;
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
    
  
    if (this.state === PLAYER_STATE.ATTACK) {
      this.anims.play('knife_attack', true);

      if(this.anims.currentFrame.textureFrame === 'survivor-meleeattack_knife_14'){
        this.state = PLAYER_STATE.IDLE
      }
    } else {
      if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
        this.state = PLAYER_STATE.MOVE
        this.anims.play('knife_move', true);
      } else {
        this.state = PLAYER_STATE.IDLE
        this.anims.play('knife_idle', true);
      }
    }

    this.setRotation(
      Phaser.Math.Angle.Between(
        this.x, this.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY));
  }
}
