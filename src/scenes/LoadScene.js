/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import loadBg from '../assets/menu/loadBG.jpg';
import backgound from '../assets/menu/bg.jpg';
import optionBtn from '../assets/menu/options_button.png';
import playBtn from '../assets/menu/play_button.png';
import logo from '../assets/menu/logo.png';
import scull from '../assets/menu/scull.png';

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadScene' });
  }

  preload() {
    this.load.image('load_bg', loadBg, 0, 0);
    this.add.image(0, 0, 'load_bg');
    this.load.image('menu_bg', backgound, 0, 0);
    this.load.image('options_btn', optionBtn);
    this.load.image('play_btn', playBtn);
    this.load.image('logo', logo);
    this.load.image('scull', scull);

    this.showLoading(this);
  }

  showLoading(scene) {
    const { width } = scene.cameras.main;
    const { height } = scene.cameras.main;

    const loadingText = scene.make.text({
      x: width / 2,
      y: height / 2 - 30,
      text: 'Loading',
      style: {
        font: '25px monospace',
        fill: '#fff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const loadingBox = scene.add.graphics();
    loadingBox.fillStyle(0X222222, 0.8);
    loadingBox.fillRect(width / 3, height / 2, width / 3 + 40, 50);

    const loadingBar = scene.add.graphics();

    scene.load.on('progress', (percent) => {
      loadingBar.clear();
      loadingBar.fillStyle(0XFFFFFF);
      loadingBar.fillRect(width / 3 + 20, height / 2 + 10, (width / 3) * percent, 30).setDepth(1);
    });
  }

  create() {
    this.scene.start('MenuScene');
  }
}
