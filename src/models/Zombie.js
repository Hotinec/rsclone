import Phaser from 'phaser';
import townMaleAtlas from '../assets/zombie/zombie_atlas.json';
import townMale from '../assets/zombie/zombie.png';
import maleAnim from '../assets/zombie/zombie_anim.json';
import { gameState } from '../scenes/DarkScene';

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(data, player) {
    const {
      scene, x, y, texture, frame,
    } = data;
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);
    this.player = player;

    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(0.4);
    scene.physics.world.enableBody(this);
    this.setImmovable(true);

    this.isAttack = false;
    this.hp = 2;
  }

  static preload(scene) {
    scene.load.atlas('zombie', townMale, townMaleAtlas);
    scene.load.animation('zombie_anim', maleAnim);
  }

  get velocity() {
    return this.body.velocity;
  }

  update() {
    const playerVelocity = new Phaser.Math.Vector2();
    playerVelocity.normalize();

    if (this.isAttack) {
      this.anims.play('zombie_attack', true);

      if (this.anims.currentFrame.textureFrame === 'skeleton-attack_8') {
        if (this.player && this.player.hp <= 0) {
          this.player.destroy();
          gameState('black');
          const x = this.scene.scene.get('GameScene');
          x.scene.restart();
        }

        this.isAttack = false;
      }
    } else if (this.isAttack) {
      this.anims.play('zombie_idle', true);
    } else {
      this.anims.play('zombie_move', true);
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
