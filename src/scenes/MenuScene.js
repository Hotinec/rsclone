/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';

import backgound from '../assets/menu/bg.jpg';
import logo from '../assets/menu/logo.png';
import scull from '../assets/menu/scull.png';
import emptyScull from '../assets/menu/scull-empty.png';
import theme from '../assets/audio/theme.mp3';
import intro from '../assets/audio/intro.mp3';
import title from '../assets/menu/empty.png';
import btn from '../assets/menu/btn.png';
import MainMenu from '../menu/Main';
import OptionsMenu from '../menu/Options';
import Score from '../menu/BestScore';
import BaseScene from './BaseScene';

export class MenuScene extends BaseScene {
  constructor() {
    super({ key: 'MenuScene' });
    this.soundOn = false;
  }

  preload() {
    this.load.audio('theme', theme);
    this.load.audio('intro', intro);
    this.load.image('menu_bg', backgound, 0, 0);
    this.load.image('logo', logo);
    this.load.image('scull', scull);
    this.load.image('title', title);
    this.load.image('btn', btn);
    this.load.image('empty-scull', emptyScull);

    // this.load.scenePlugin({
    //   key: 'rexuiplugin',
    //   url: 'phaser3-rex-plugins/templates/ui/ui-plugin.js',
    //   sceneKey: 'rexUI',
    // });
  }

  create() {
    this.setMusic();
    if (this.soundOn) this.audio.play();
    this.sound.setVolume(0.5);

    this.createBG();
    this.main = new MainMenu(this);
    this.options = new OptionsMenu(this);
    this.score = new Score(this);

    this.main.init();
    this.setHoverImg();
  }
}
