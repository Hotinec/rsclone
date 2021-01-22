import Phaser from 'phaser';
import townMaleAtlas from '../assets/zombie/zombie_atlas.json';
import townMale from '../assets/zombie/zombie.png';
import maleAnim from '../assets/zombie/zombie_anim.json';
import zombie2 from '../assets/zombie/zombie_2.png';
import zombie2Atlas from '../assets/zombie/zombie_2_atlas.json';
import zombie2Anim from '../assets/zombie/zombie_2_anim.json';
import { zombieProperties } from '../properties';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(data, player) {
    const {
      scene, x, y, type,
    } = data;

    const {
      texture, frame, scale, circle, hp,
    } = zombieProperties[type];

    super(scene, x, y, texture, frame);

    this.type = type;
    this.scene.add.existing(this);
    this.player = player;

    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(scale);
    scene.physics.world.enableBody(this);
    this.setCircle(circle, this.width / 4, this.height / 4);

    this.isAttack = false;
    this.hp = hp;
  }

  static preload(scene) {
    scene.load.atlas('zombie', townMale, townMaleAtlas);
    scene.load.animation('zombie_anim', maleAnim);
    scene.load.atlas('zombie_2', zombie2, zombie2Atlas);
    scene.load.animation('zombie_2_anim', zombie2Anim);
  }

  get velocity() {
    return this.body.velocity;
  }

  update() {
    const playerVelocity = new Phaser.Math.Vector2();
    playerVelocity.normalize();

    if (this.isAttack) {
      const { textureFrame } = this.anims.currentFrame;
      const { attackEndFrame, attackAnim } = zombieProperties[this.type];
      this.anims.play(attackAnim, true);

      if (textureFrame === attackEndFrame) {
        if (this.player && this.player.hp <= 0) {
          this.player.destroy();
        }

        this.isAttack = false;
      }
    } else {
      const { moveAnim } = zombieProperties[this.type];
      this.anims.play(moveAnim, true);
    }

    this.setRotation(
      Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.scene.player.x,
        this.scene.player.y,
      ),
    );
  }
}
