import background from '../assets/menu/bg.jpg';
import logo from '../assets/menu/logo.png';
import scull from '../assets/menu/scull.png';
import emptyScull from '../assets/menu/scull-empty.png';
import theme from '../assets/audio/theme.mp3';
import intro from '../assets/audio/intro.mp3';
import titleImg from '../assets/menu/empty.png';
import btn from '../assets/menu/btn.png';
import mute from '../assets/menu/mute.png';
import unmute from '../assets/menu/unmute.png';
import fullOn from '../assets/menu/fullon.png';
import fullOff from '../assets/menu/fulloff.png';
import close from '../assets/menu/close.png';
import MainMenu from '../menu/Main';
import OptionsMenu from '../menu/Options';
import ScoreMenu from '../menu/BestScore';
import AboutMenu from '../menu/About';
import enLang from '../assets/menu/en.png';
import ruLang from '../assets/menu/ru.png';
import nextImg from '../assets/menu/next.png';
import prevImg from '../assets/menu/prev.png';
import logoRss from '../assets/menu/rss.png';
import keyBtn from '../assets/menu/keyBtn.png';
import BaseScene from './BaseScene';
import languages from '../vocabluary';

export class MenuScene extends BaseScene {
  soundOn: boolean;

  main: MainMenu;

  options: OptionsMenu;

  score: ScoreMenu;

  about: AboutMenu;

  languages: typeof languages;

  currentLang: unknown;

  prevLang: unknown;

  constructor() {
    super({ key: 'MenuScene' });
    this.soundOn = false;
    this.languages = languages;
    this.currentLang = languages.en;
  }

  preload(): void {
    this.load.audio('theme', theme);
    this.load.audio('intro', intro);
    this.load.image('menu_bg', background);
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
  }

  create(): void {
    this.setMusic();
    if (this.soundOn) this.audio.play();
    // @ts-ignore
    this.sound.setVolume(0.5);

    this.createBG();
    this.main = new MainMenu(this);
    this.options = new OptionsMenu(this);
    this.score = new ScoreMenu(this);
    this.about = new AboutMenu(this);

    this.main.init();
    this.setHoverImg();
  }

  updateText() : void {
    const {
      volumeTitle, fullScreen, language, title, backBtn,
    } = this.options;
    const arr = [backBtn, volumeTitle, fullScreen, language, title];
    // @ts-ignore
    const { vacabluary } = this.prevLang;

    arr.forEach((el) => {
      let element = el;

      if (element instanceof Phaser.GameObjects.Image) {
        // @ts-ignore
        element = element.textContent;
      }

      const keys = Object.keys(vacabluary);
      keys.forEach((key) => {
        const text = vacabluary[key];
        // @ts-ignore
        if (text === element.text) {
          // @ts-ignore
          const { vacabluary: newVacabulary } = this.currentLang;
          const newText = newVacabulary[key];
          // @ts-ignore
          element.setText(newText);
        }
      });
    });
  }
}
