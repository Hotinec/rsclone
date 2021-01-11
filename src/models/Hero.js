import Phaser from 'phaser';
import  knife from '../assets/player/body/knife/knife.png';
import knifeAtlas from '../assets/player/body/knife/knife_atlas.json';
import knifeAnim from '../assets/player/body/knife/knife_anim.json';


export class Hero extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let {scene, x, y, texture, frame} = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);

    this.scale = 0.5;

    const {Body, Bodies} = Phaser.Physics.Matter.Matter;
    let playerCollider = Bodies.circle(
      this.x, 
      this.y, 
      52, 
      {isSensor: false, label: 'playerCollider'}
    );
    let playerSensor = Bodies.circle(
      this.x,
      this.y,
      74,
      {isSensor: true, label: 'playerSensor'}
    );
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
  }

  static preload(scene) {
    scene.load.atlas('knife', knife, knifeAtlas);
    scene.load.animation('knife_anim', knifeAnim);
  }

  get velocity() {
    return this.body.velocity;
  }

  update(pointer) {
    const speed = 4;
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
  
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('knife_move', true);
    } else {
      this.anims.play('knife_idle', true);
    }

    this.setRotation(
      Phaser.Math.Angle.Between(
        this.x, this.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY));
  }
}