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
import pauseImg from '../assets/status/pause.png';
import { WEAPON } from '../constants';
import { GameScene } from './GameScene';

export class StatusScene extends Phaser.Scene {
  fullWidth: number;

  gameScene: GameScene;

  rightShadowCap: Phaser.GameObjects.Image;

  leftCap: Phaser.GameObjects.Image;

  middle: Phaser.GameObjects.Image;

  rightCap: Phaser.GameObjects.Image;

  scoreText: Phaser.GameObjects.Text;

  handgunAmmoImg: Phaser.GameObjects.Image;

  shotgunAmmoImg: Phaser.GameObjects.Image;

  rifleAmmoImg: Phaser.GameObjects.Image;

  timedEvent: Phaser.Time.TimerEvent;

  ammoText: Phaser.GameObjects.Text;

  timeText: Phaser.GameObjects.Text;

  keyEsc:Phaser.Input.Keyboard.Key;

  // eslint-disable-next-line @typescript-eslint/ban-types
  onClockEvent: Function | undefined;

  constructor() {
    super('StatusScene');
  }

  preload(): void {
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

    this.load.image('pause', pauseImg);
  }

  init(): void {
    this.fullWidth = 150;
  }

  create(): void {
    // @ts-ignore
    this.gameScene = this.scene.get('GameScene');

    this.scene.moveAbove('StatusScene', 'GameScene');
    this.scene.bringToTop();

    const rt = this.add.renderTexture(0, 0, window.innerWidth * 2, 60);
    rt.fill(0x000000, 0.65);

    this.createHealthBarView();
    this.createScoreView();
    this.createAmmoView();
    this.createTimeView();
    this.createPauseBtn();
    this.createEscKey();
  }

  setMeterPercentage(hp = 10): void {
    const width = (this.fullWidth * hp) / 10;

    this.middle.displayWidth = width;
    this.rightCap.x = this.middle.x + this.middle.displayWidth;
  }

  createHealthBarView(): void {
    const y = 31;
    const x = 50;

    const heartImg = this.add.image(26, 30, 'heart');
    heartImg.displayHeight = 20;
    heartImg.displayWidth = 20;

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

  createScoreView(): void {
    const { x } = this.rightShadowCap;
    const scoreImage = this.add.image(x + 50, 30, 'score-image');
    scoreImage.setScale(0.2);
    this.scoreText = this.add.text(scoreImage.x + 30, 23, '0', { color: '#a3a3a3' });
  }

  createAmmoView(): void {
    const { x } = this.scoreText;
    this.handgunAmmoImg = this.add.image(x + 50, 30, 'handgunBullet');
    this.shotgunAmmoImg = this.add.image(x + 50, 30, 'shotgunBullet');
    this.rifleAmmoImg = this.add.image(x + 50, 30, 'rifleBullet');

    this.handgunAmmoImg.setScale(0.6);
    this.shotgunAmmoImg.setScale(0.8);
    this.rifleAmmoImg.setScale(0.6);

    this.handgunAmmoImg.setVisible(false);
    this.shotgunAmmoImg.setVisible(false);
    this.rifleAmmoImg.setVisible(false);
    const { x: ammoX } = this.shotgunAmmoImg;
    this.ammoText = this.add.text(ammoX + 30, 23, '', { color: '#a3a3a3' });
  }

  createTimeView(): void {
    this.timedEvent = this.time.addEvent({
      delay: 6000000, callback: this.onClockEvent, callbackScope: this, repeat: 1,
    });
    this.timeText = this.add.text(window.innerWidth - 100, 23, '', { color: '#a3a3a3' });
  }

  createPauseBtn(): void {
    const { width, height } = this.gameScene.game.config;
    const pause = this.add.renderTexture(
      Number(width) - 96, Number(height) - 60, 110, 60,
    );
    pause.fill(0x000000, 0.65);
    pause.setInteractive()
      .on('pointerup', () => {
        this.gameScene.scene.pause();
        this.scene.pause();
        this.scene.launch('PauseScene');
      })
      .on('pointerout', () => {
        pause.clear();
        pause.fill(0x000000, 0.65);
      })
      .on('pointerover', () => {
        pause.fill(0x000000, 0.9);
      });

    const pauseImage = this.add.image(Number(width) - 48, Number(height) - 30, 'pause');
    pauseImage.setScale(0.8);
  }

  updateAmmo(): void {
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

  updateAmmoImage(ammo: Phaser.GameObjects.Image): void {
    this.handgunAmmoImg.setVisible(false);
    this.shotgunAmmoImg.setVisible(false);
    this.rifleAmmoImg.setVisible(false);

    ammo.setVisible(true);
  }

  updateScore(): void {
    const { score } = this.gameScene;
    this.scoreText.setText(`${score}`);
  }

  updateTime(): void {
    const time = this.timedEvent.getElapsedSeconds();

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - (minutes * 60));

    this.timeText.setText(
      `${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(seconds)}`,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  addZero(number: number): string {
    return (`0${number}`).slice(-2);
  }

  update(): void {
    if (this.gameScene.player) {
      const { hp } = this.gameScene.player;
      this.setMeterPercentage(hp);
      this.updateAmmo();
      this.updateScore();
    }
    this.updateTime();
  }

  createEscKey(): void {
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keyEsc.on('down', () => {
      this.gameScene.scene.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    });
  }
}
