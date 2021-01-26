/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';

import gameMusic from '../assets/audio/game.mp3';
import gameOverMusic from '../assets/audio/gameOver.mp3';
import saveBtn from '../assets/menu/save-btn.png';

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  init(theme) {
    this.theme = theme;
  }

  preload() {
    this.load.audio('game-music', gameMusic);
    this.load.audio('gameOver-music', gameOverMusic);
    this.load.image('save-btn', saveBtn);
    this.setMusic();
    this.showLoading();
  }

  showLoading() {
    const { width, height } = this.cameras.main;

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: 'Loading',
      style: {
        font: '25px monospace',
        fill: '#fff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const loadingBox = this.add.graphics();
    loadingBox.fillStyle(0X222222, 0.8);
    loadingBox.fillRect(width / 3, height / 2, width / 3 + 40, 50);

    const loadingBar = this.add.graphics();

    this.load.on('progress', (percent) => {
      loadingBar.clear();
      loadingBar.fillStyle(0XFFFFFF);
      loadingBar.fillRect(width / 3 + 20, height / 2 + 10, (width / 3) * percent, 30).setDepth(1);
    });
  }

  setMusic() {
    const menu = this.scene.get('MenuScene');

    this.loadingMusic = this.sound.add('intro');
    if (menu.soundOn) this.loadingMusic.play();
  }

  create() {
    this.loadingMusic.stop();
    this.scene.start('GameScene', this.theme);
  }
}
