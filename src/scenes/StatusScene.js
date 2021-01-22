/* eslint-disable class-methods-use-this */
/* eslint-disable no-shadow */
import Phaser from 'phaser';
import heart from '../assets/status/heart.png';
import leftCap from '../assets/status/barHorizontal_red_left.png';
import middle from '../assets/status/barHorizontal_red_mid.png';
import rightCap from '../assets/status/barHorizontal_red_right.png';
import leftShadow from '../assets/status/barHorizontal_shadow_left.png';
import middleShadow from '../assets/status/barHorizontal_shadow_mid.png';
import rightShadow from '../assets/status/barHorizontal_shadow_right.png';
import handgunBullet from '../assets/weapon/handgun_bullet.png';
import shotgunBullet from '../assets/weapon/shotgun_bullet.png';
import rifleBullet from '../assets/weapon/rifle_bullet.png';
import scull from '../assets/menu/scull.png';
import { WEAPON } from '../constants';

export class StatusScene extends Phaser.Scene {
  constructor() {
    super('StatusScene');
  }

  preload() {
    this.load.image('left-cap', leftCap);
    this.load.image('middle', middle);
    this.load.image('right-cap', rightCap);
    this.load.image('left-cap-shadow', leftShadow);
    this.load.image('middle-shadow', middleShadow);
    this.load.image('right-cap-shadow', rightShadow);

    this.load.image('heart', heart);

    this.load.image('shotgunBullet', shotgunBullet);
    this.load.image('handgunBullet', handgunBullet);
    this.load.image('rifleBullet', rifleBullet);

    this.load.image('score-image', scull);
  }

  init() {
    this.fullWidth = 150;
  }

  create() {
    this.gameScene = this.scene.get('GameScene');
    // position
    this.scene.moveAbove('StatusScene', this.gameScene);
    this.scene.bringToTop();
    // background
    const rt = this.add.renderTexture(0, 0, window.innerWidth * 2, 60);
    rt.fill(0x000000, 0.65);
    // content
    this.createHealthBarView();
    this.createScoreView();
    this.createAmmoView();
    this.createTimeView();
  }

  setMeterPercentage(hp = 10) {
    const width = (this.fullWidth * hp) / 10;

    this.middle.displayWidth = width;
    this.rightCap.x = this.middle.x + this.middle.displayWidth;
  }

  createHealthBarView() {
    const y = 31;
    const x = 50;

    const heart = this.add.image(26, 30, 'heart');
    heart.displayHeight = 20;
    heart.displayWidth = 20;

    const leftShadowCap = this.add.image(x, y, 'left-cap-shadow')
      .setOrigin(0, 0.5);

    const middleShadowCap = this.add.image(leftShadowCap.x + leftShadowCap.width, y, 'middle-shadow')
      .setOrigin(0, 0.5);
    middleShadowCap.displayWidth = this.fullWidth;

    this.rightShadowCap = this.add.image(middleShadowCap.x + middleShadowCap.displayWidth, y, 'right-cap-shadow')
      .setOrigin(0, 0.5);

    this.leftCap = this.add.image(x, y, 'left-cap')
      .setOrigin(0, 0.5);

    this.middle = this.add.image(this.leftCap.x + this.leftCap.width, y, 'middle')
      .setOrigin(0, 0.5);

    this.rightCap = this.add.image(this.middle.x + this.middle.displayWidth, y, 'right-cap')
      .setOrigin(0, 0.5);

    leftShadowCap.displayHeight = 6;
    middleShadowCap.displayHeight = 6;
    this.rightShadowCap.displayHeight = 6;
    this.leftCap.displayHeight = 6;
    this.middle.displayHeight = 6;
    this.rightCap.displayHeight = 6;
  }

  createScoreView() {
    const scoreImage = this.add.image(this.rightShadowCap.x + 50, 30, 'score-image');
    scoreImage.setScale(0.2);
    this.scoreText = this.add.text(scoreImage.x + 30, 23, '0', { color: '#a3a3a3' });
  }

  createAmmoView() {
    this.handgunAmmoImg = this.add.image(this.scoreText.x + 50, 30, 'handgunBullet');
    this.shotgunAmmoImg = this.add.image(this.scoreText.x + 50, 30, 'shotgunBullet');
    this.rifleAmmoImg = this.add.image(this.scoreText.x + 50, 30, 'rifleBullet');

    this.handgunAmmoImg.setScale(0.6);
    this.shotgunAmmoImg.setScale(0.8);
    this.rifleAmmoImg.setScale(0.6);

    this.handgunAmmoImg.setVisible(false);
    this.shotgunAmmoImg.setVisible(false);
    this.rifleAmmoImg.setVisible(false);
    this.ammoText = this.add.text(this.shotgunAmmoImg.x + 30, 23, '', { color: '#a3a3a3' });
  }

  createTimeView() {
    this.timedEvent = this.time.addEvent({
      delay: 6000000, callback: this.onClockEvent, callbackScope: this, repeat: 1,
    });
    this.timeText = this.add.text(window.innerWidth - 100, 23, '', { color: '#a3a3a3' });
  }

  updateAmmo() {
    const { magazine } = this.gameScene.laserGroup;

    switch (this.gameScene.player.anim) {
      case WEAPON.HANDGUN:
        this.ammoText.setText(`${magazine.handgun}/${magazine.handgunAll}`);
        this.updateAmmoImage(this.handgunAmmoImg);
        break;
      case WEAPON.SHOTGUN:
        this.ammoText.setText(`${magazine.shotgun}/${magazine.shotgunAll}`);
        this.updateAmmoImage(this.shotgunAmmoImg);
        break;
      case WEAPON.RIFLE:
        this.ammoText.setText(`${magazine.rifle}/${magazine.rifleAll}`);
        this.updateAmmoImage(this.rifleAmmoImg);
        break;
      default:
        break;
    }
  }

  updateAmmoImage(ammo) {
    this.handgunAmmoImg.setVisible(false);
    this.shotgunAmmoImg.setVisible(false);
    this.rifleAmmoImg.setVisible(false);

    ammo.setVisible(true);
  }

  updateScore() {
    this.scoreText.setText(`${this.gameScene.score}`);
  }

  updateTime() {
    const time = this.timedEvent.getElapsedSeconds();

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - (minutes * 60));

    this.timeText.setText(
      `${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(seconds)}`,
    );
  }

  addZero(number) {
    return (`0${number}`).slice(-2);
  }

  update() {
    if (this.gameScene.player) {
      const { hp } = this.gameScene.player;
      this.setMeterPercentage(hp);
      this.updateAmmo();
      this.updateScore();
    }
    this.updateTime();
  }
}
