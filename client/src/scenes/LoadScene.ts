import Phaser from 'phaser';

import gameMusic from '../assets/audio/game.mp3';
import gameOverMusic from '../assets/audio/gameOver.mp3';
import saveBtn from '../assets/menu/save-btn.png';
import terrain from '../assets/map/terrain.png';
import mapJSON from '../assets/map/map.json';
import blood from '../assets/blood/blood.png';
import firstAid from '../assets/first-aid-kit.png';
import shootSound from '../assets/audio/pistol.wav';
import knifeAttacke from '../assets/audio/knifeAttack.wav';
import reload from '../assets/audio/reload.wav';
import top from '../assets/audio/top.wav';
import zombieCry from '../assets/audio/krik-zombie.mp3';
import {
  Zombie, Hero, Weapon, Ammo, Fire, Laser,
} from '../models';

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
    this.load.image('save-btn', saveBtn);
    this.setMusic();
    this.showLoading();
    this.load.image('blood', blood);
    this.load.image('first_aid', firstAid);

    // map
    this.load.image('tilesets', terrain);
    this.load.tilemapTiledJSON('map', mapJSON);
    this.scene.launch('StatusScene');

    // models
    Zombie.preload(this);
    Hero.preload(this);
    Weapon.preload(this);
    Laser.preload(this);
    Fire.preload(this);
    Ammo.preload(this);

    // audio
    this.load.audio('shoot', shootSound);
    this.load.audio('khife_attack', knifeAttacke);
    this.load.audio('reload', reload);
    this.load.audio('top', top);
    this.load.audio('cry', zombieCry);
  }

  showLoading(): void {
    const { width, height } = this.cameras.main;
    // @ts-ignore
    const { loadingState } = this.menu.currentLang.vocabulary;

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
