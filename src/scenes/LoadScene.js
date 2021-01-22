/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
    this.showLoading();
  }

  showLoading() {
    const { width } = this.cameras.main;
    const { height } = this.cameras.main;

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

  create() {
    this.scene.start('GameScene');
  }
}
