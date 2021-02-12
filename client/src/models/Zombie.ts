import Phaser from 'phaser';
import townMaleAtlas from '../assets/zombie/zombie_atlas.json';
import townMale from '../assets/zombie/zombie.png';
import maleAnim from '../assets/zombie/zombie_anim.json';
import zombie2 from '../assets/zombie/zombie_2.png';
import zombie2Atlas from '../assets/zombie/zombie_2_atlas.json';
import zombie2Anim from '../assets/zombie/zombie_2_anim.json';
import { zombieProperties } from '../properties';
import { Hero } from './Hero';

interface IZombie {
  scene: Phaser.Scene;
  x: number;
  y: number;
  type: string
}

export class Zombie extends Phaser.Physics.Arcade.Sprite {
  player: Hero;

  isAttack: boolean;

  hp: number;

  constructor(data: IZombie, player: Hero) {
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

  static preload(scene: Phaser.Scene): void {
    scene.load.atlas('zombie', townMale, townMaleAtlas);
    scene.load.animation('zombie_anim', maleAnim);
    scene.load.atlas('zombie_2', zombie2, zombie2Atlas);
    scene.load.animation('zombie_2_anim', zombie2Anim);
  }

  get velocity(): Phaser.Math.Vector2 {
    return this.body.velocity;
  }

  update(): void {
    const playerVelocity = new Phaser.Math.Vector2();
    playerVelocity.normalize();
    if (this.isAttack) {
      const { textureFrame } = this.anims.currentFrame;
      const { attackEndFrame, attackAnim } = zombieProperties[this.type];
      this.anims.play(attackAnim, true);
      if (textureFrame === attackEndFrame) {
        if (this.player && this.player.hp <= 0) {
          const gameScene = this.scene.scene.get('GameScene');
          // @ts-ignore
          gameScene.gameMusic.stop();
          this.scene.scene.stop('StatusScene');
          this.scene.scene.start('GameOverScene');
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
        // @ts-ignore
        this.scene.player.x,
        // @ts-ignore
        this.scene.player.y,
      ),
    );
  }
}
