import background from '../assets/menu/bg.jpg';
import logo from '../assets/menu/logo.png';
import scull from '../assets/menu/scull.png';
import emptyScull from '../assets/menu/scull-empty.png';
import theme from '../assets/audio/theme.mp3';
import intro from '../assets/audio/intro.mp3';
import title from '../assets/menu/empty.png';
import btn from '../assets/menu/btn.png';
import mute from '../assets/menu/mute.png';
import unmute from '../assets/menu/unmute.png';
import fullOn from '../assets/menu/fullon.png';
import fullOff from '../assets/menu/fulloff.png';
import close from '../assets/menu/close.png';
import MainMenu from '../menu/Main';
import OptionsMenu from '../menu/Options';
import Score from '../menu/BestScore';
import BaseScene from './BaseScene';

export class MenuScene extends BaseScene {
  soundOn: boolean;

  main: MainMenu;

  options: OptionsMenu;

  score: Score;

  constructor() {
    super({ key: 'MenuScene' });
    this.soundOn = false;
  }

  preload(): void {
    this.load.audio('theme', theme);
    this.load.audio('intro', intro);
    // @ts-ignore
    this.load.image('menu_bg', background, 0, 0);
    this.load.image('logo', logo);
    this.load.image('scull', scull);
    this.load.image('title', title);
    this.load.image('btn', btn);
    this.load.image('empty-scull', emptyScull);
    this.load.image('mute', mute);
    this.load.image('unmute', unmute);
    this.load.image('full-on', fullOn);
    this.load.image('full-off', fullOff);
    this.load.image('close', close);
  }

  create(): void {
    this.setMusic();
    if (this.soundOn) this.audio.play();
    // @ts-ignore
    this.sound.setVolume(0.5);

    this.createBG();
    this.main = new MainMenu(this);
    this.options = new OptionsMenu(this);
    this.score = new Score(this);

    this.main.init();
    this.setHoverImg();
  }
}
