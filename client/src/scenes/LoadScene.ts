import Phaser from 'phaser';

// import { MenuScene } from './MenuScene';

import gameMusic from '../assets/audio/game.mp3';
import gameOverMusic from '../assets/audio/gameOver.mp3';

export class LoadScene extends Phaser.Scene {
  theme: string | unknown;

  menu: Phaser.Scene;

  loadingMusic: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'LoadScene' });
  }

  init(theme: string): void {
    this.theme = theme;
  }

  preload(): void {
    this.load.audio('game-music', gameMusic);
    this.load.audio('gameOver-music', gameOverMusic);
    this.setMusic();
    this.showLoading();
  }

  showLoading(): void {
    const { width, height } = this.cameras.main;
    // @ts-ignore
    const { loadingState } = this.menu.currentLang.vacabluary;

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: loadingState,
      style: {
        font: '25px monospace, sans-serif',
        color: '#fff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const loadingBox = this.add.graphics();
    loadingBox.fillStyle(0X222222, 0.8);
    loadingBox.fillRect(width / 3, height / 2, width / 3 + 40, 50);

    const loadingBar = this.add.graphics();

    this.load.on('progress', (percent: number) => {
      loadingBar.clear();
      loadingBar.fillStyle(0XFFFFFF);
      loadingBar.fillRect(width / 3 + 20, height / 2 + 10, (width / 3) * percent, 30).setDepth(1);
    });
  }

  setMusic(): void {
    // @ts-ignore
    this.menu = this.scene.get('MenuScene');

    this.loadingMusic = this.sound.add('intro');
    // @ts-ignore
    if (this.menu.soundOn) this.loadingMusic.play();
  }

  create(): void {
    this.loadingMusic.stop();
    // @ts-ignore
    this.scene.start('GameScene', this.theme);
  }
}
