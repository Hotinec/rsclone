/* eslint-disable guard-for-in */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';

import background from '../assets/menu/bg.jpg';
import logo from '../assets/menu/logo.png';
import logoGithub from '../assets/menu/github-logo.svg';
import logoRss from '../assets/menu/rss-logo.svg';
import scull from '../assets/menu/scull.png';
import emptyScull from '../assets/menu/scull-empty.png';
import theme from '../assets/audio/theme.mp3';
import intro from '../assets/audio/intro.mp3';
import titleImg from '../assets/menu/empty.png';
import btn from '../assets/menu/btn.png';
import keyBtn from '../assets/menu/keyBtn.png';
import mute from '../assets/menu/mute.png';
import unmute from '../assets/menu/unmute.png';
import fullOn from '../assets/menu/fullon.png';
import fullOff from '../assets/menu/fulloff.png';
import close from '../assets/menu/close.png';
import MainMenu from '../menu/Main';
import OptionsMenu from '../menu/Options';
import ScoreMenu from '../menu/BestScore';
import BaseScene from './BaseScene';
import AboutMenu from '../menu/About';
import enLang from '../assets/menu/en.png';
import ruLang from '../assets/menu/ru.png';
import nextImg from '../assets/menu/next.png';
import prevImg from '../assets/menu/prev.png';

import languages from '../vacabluary';

export class MenuScene extends BaseScene {
  constructor() {
    super({ key: 'MenuScene' });
    this.soundOn = false;
    this.languages = languages;
    this.currentLang = languages.en;
  }

  preload() {
    this.load.audio('theme', theme);
    this.load.audio('intro', intro);
    this.load.image('menu_bg', background, 0, 0);
    this.load.image('logo', logo);
    this.load.image('scull', scull);
    this.load.image('title', titleImg);
    this.load.image('btn', btn);
    this.load.image('empty-scull', emptyScull);
    this.load.image('mute', mute);
    this.load.image('unmute', unmute);
    this.load.image('full-on', fullOn);
    this.load.image('full-off', fullOff);
    this.load.image('close', close);
    this.load.image('key-btn', keyBtn);
    this.load.image('en-on', enLang);
    this.load.image('next-btn', nextImg);
    this.load.image('prev-btn', prevImg);
    this.load.image('ru-on', ruLang);
    this.load.image('rss-logo', logoRss);
    this.load.image('github-logo', logoGithub);
  }

  create() {
    this.setMusic();
    if (this.soundOn) this.audio.play();
    this.sound.setVolume(0.5);

    this.createBG();
    this.main = new MainMenu(this);
    this.options = new OptionsMenu(this);
    this.score = new ScoreMenu(this);
    this.about = new AboutMenu(this);

    this.main.init();
    this.setHoverImg();
  }

  updateText() {
    const {
      volumeTitle, fullScreen, language, title, backBtn,
    } = this.options;
    const arr = [backBtn, volumeTitle, fullScreen, language, title];
    const { vacabluary } = this.prevLang;

    arr.forEach((el) => {
      let element = el;

      if (element instanceof Phaser.GameObjects.Image) {
        element = element.textContent;
      }

      const keys = Object.keys(vacabluary);
      keys.forEach((key) => {
        const text = vacabluary[key];
        if (text === element.text) {
          const { vacabluary: newVacabulary } = this.currentLang;
          const newText = newVacabulary[key];
          element.setText(newText);
        }
      });
    });
  }
}
