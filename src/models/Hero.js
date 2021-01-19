import Phaser from 'phaser';
import knife from '../assets/player/body/knife/knife.png';
import knifeAtlas from '../assets/player/body/knife/knife_atlas.json';
import knifeAnim from '../assets/player/body/knife/knife_anim.json';
import { PLAYER_STATE } from '../constants';
import handgun from '../assets/player/body/handgun/handgun.png';
import handgunAtlas from '../assets/player/body/handgun/handgun_atlas.json';
import handgunAnim from '../assets/player/body/handgun/handgun_anim.json';
import shotgun from '../assets/player/body/shotgun/shortgun.png';
import shotgunAtlas from '../assets/player/body/shotgun/shortgun_atlas.json';
import shotgunAnim from '../assets/player/body/shotgun/shortgun_anim.json';
import rifle from '../assets/player/body/rifle/rifle.png';
import rifleAtlas from '../assets/player/body/rifle/rifle_atlas.json';
import rifleAnim from '../assets/player/body/rifle/rifle_anim.json';

export class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(data) {
    const {
      scene, x, y, texture, frame,
    } = data;
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);

    scene.sys.updateList.add(this);
    scene.sys.displayList.add(this);
    this.setScale(0.4);
    scene.physics.world.enableBody(this);
    this.setImmovable(true);
    this.hp = 10;
    this.setCircle(70, this.width / 4, this.height / 4);
    this.state = PLAYER_STATE.IDLE;

    this.anim = 'knife';
    this.weapon = ['knife'];
    this.isReload = false;
  }

  static preload(scene) {
    // knife
    scene.load.atlas('knife', knife, knifeAtlas);
    scene.load.animation('knife_anim', knifeAnim);
    // handgun
    scene.load.atlas('handgun-body', handgun, handgunAtlas);
    scene.load.animation('handgun_anim', handgunAnim);
    // shotgun
    scene.load.atlas('shotgun-body', shotgun, shotgunAtlas);
    scene.load.animation('shotgun_anim', shotgunAnim);
    // rifle
    scene.load.atlas('rifle-body', rifle, rifleAtlas);
    scene.load.animation('rifle_anim', rifleAnim);
  }

  get velocity() {
    return this.body.velocity;
  }

  changeWeapon(texture, frame, anim) {
    this.setTexture(texture, frame);
    this.anim = anim;
  }

  update(pointer) {
    const speed = 250;
    const playerVelocity = new Phaser.Math.Vector2();

    if (this.inputKeys.knife.isDown && this.weapon.includes('knife')) {
      this.changeWeapon('knife', 'survivor-idle_knife_0', 'knife');
    } else if (this.inputKeys.pistol.isDown && this.weapon.includes('pistol')) {
      this.changeWeapon('handgun-body', 'survivor-idle_handgun_0', 'handgun');
    } else if (this.inputKeys.shotgun.isDown && this.weapon.includes('shotgun')) {
      this.changeWeapon('shotgun-body', 'survivor-idle_shotgun_0', 'shotgun');
    } else if (this.inputKeys.rifle.isDown && this.weapon.includes('rifle')) {
      this.changeWeapon('rifle-body', 'survivor-idle_rifle_0', 'rifle');
    }

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
      if (this.anim === 'knife') {
        this.anims.play('knife_attack', true);
      } else {
        this.anims.play(`${this.anim}_shoot`, true);
      }

      if (this.anims.currentFrame.textureFrame === `survivor-shoot_${this.anim}_2`
      || this.anims.currentFrame.textureFrame === 'survivor-meleeattack_knife_14') {
        // this.state = PLAYER_STATE.IDLE;
      }
    } else if (this.isReload) {
      this.scene.reloadSound.play();
      this.anims.play(`${this.anim}_reload`, true);
      if (this.anims.currentFrame.textureFrame === `survivor-reload_${this.anim}_10`) {
        this.isReload = false;
      }
    } else if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play(`${this.anim}_move`, true);
    } else {
      this.anims.play(`${this.anim}_idle`, true);
    }

    this.setRotation(
      Phaser.Math.Angle.Between(
        this.x,
        this.y,
        pointer.x + this.scene.cameras.main.scrollX,
        pointer.y + this.scene.cameras.main.scrollY,
      ),
    );
  }
}
