// @ts-ignore
import InputText from 'phaser3-rex-plugins/plugins/inputtext';
import Phaser from 'phaser';
import BaseScene from './BaseScene';
import { IResult } from './IResult';
import { addResult } from '../services/httpService';

export class GameOverScene extends BaseScene {
  results: [] | [IResult] | string | null;

  gameScene: Phaser.Scene;

  menu: Phaser.Scene;

  score: number;

  inputText: InputText;

  saveBtn: Phaser.GameObjects.Image;

  mainMenuBtn: Phaser.GameObjects.Image;

  keyObj: Phaser.Input.Keyboard.Key;

  gameOverMusic: Phaser.Sound.BaseSound;

  date: string;

  scoreText: Phaser.GameObjects.Text;

  timeText: Phaser.GameObjects.Text;

  savingText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameOverScene' });
    this.results = GameOverScene.getResults();
  }

  create(): void {
    const { width, height } = this.game.config;
    this.getScore();
    this.setMusic();
    this.createBG();
    // @ts-ignore
    const background = this.add.renderTexture(0, 0, width, height);
    background.fill(0x000000, 0.65);
    this.setHoverImg();
    this.getInput();
    this.getDate();
    this.initInputEvents();
    this.switchOffHover();
    this.setTextContent();
  }

  static getResults(): [] {
    const resultsArr = localStorage.getItem('results');

    if (resultsArr) return JSON.parse(resultsArr);

    return [];
  }

  getScore(): void {
    this.gameScene = this.scene.get('GameScene');
    const statusScene = this.scene.get('StatusScene');
    // @ts-ignore
    const { text: timeText } = statusScene.timeText;
    // @ts-ignore
    const { score }: number = this.gameScene;
    this.score = score;
    this.time = timeText;
  }

  saveResult(): void {
    const resultsJson = JSON.stringify(this.results);
    localStorage.setItem('results', resultsJson);
  }

  getInput(): void {
    const {
      nameTitle, save, mainMenu,
    // @ts-ignore
    } = this.menu.currentLang.vacabluary;

    const config = {
      maxLength: 15,
      minLength: 1,
      placeholder: `${nameTitle}...`,
      paddingLeft: '10px',
      paddingRight: 0,
      paddingTop: '2px',
      paddingBottom: '2px',
      fontSize: '22px',
      fontFamily: 'monospace, sans-serif',
      color: '#000000',
      border: '3px solid',
      backgroundColor: '#e6e6e6',
      borderColor: '#9c9f9e',
      outline: 'none',
    };

    const { width, height } = this.game.config;

    const y = +height * 0.4 + 200;

    this.inputText = new InputText(this, +width / 2, y, 270, 40, config);
    this.add.existing(this.inputText);
    this.inputText.setOrigin(0.8, 0.5);

    const x = (width + this.inputText.displayWidth) / 2 + 5;
    this.saveBtn = this.createBtn(x, y + 3, save);

    if (save === 'СОХРАНИТЬ') {
      // @ts-ignore
      this.saveBtn.textContent.setFont('23px monospace, sans-serif');
    }
    this.saveBtn.displayWidth = 150;

    const btnY = y + this.inputText.height + 25;
    // @ts-ignore
    this.mainMenuBtn = this.createBtn(width / 2, btnY, mainMenu);
  }

  initInputEvents(): void {
    this.keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyObj.on('down', () => this.initInputEventHandler());
    this.saveBtn.on('pointerdown', () => this.initInputEventHandler());
    this.mainMenuBtn.on('pointerdown', () => this.handleMenuBtnClick());
  }

  handleMenuBtnClick(): void {
    this.gameOverMusic.stop();
    this.scene.start('MenuScene');
  }

  initInputEventHandler(): void {
    this.setResult();
    // this.saveResult();
    addResult(JSON.stringify({
      name: this.inputText.text,
      time: this.time.toString(),
      score: this.score,
    }));
    this.inputText.text = '';
    this.gameOverMusic.stop();
    this.scene.start('MenuScene');
  }

  setResult(): void {
    const result: IResult = {
      name: this.inputText.text,
      time: this.time,
      score: this.score,
      date: this.date,
    };
    if (this.results && Array.isArray(this.results)) {
      // @ts-ignore
      this.results.push(result);
    }
  }

  getDate(): void {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    this.date = `${day}/${month + 1}/${year}`;
  }

  setTextContent(): void {
    const { width, height } = this.game.config;
    const {
      gameOverText, gameOverState, scoreTitle, timeTitle,
    // @ts-ignore
    } = this.menu.currentLang.vacabluary;

    const x = +width / 2;
    const y = +height * 0.4;

    const title = this.add.text(x, +height * 0.3, gameOverState, { font: '46px monospace, sans-serif' });
    title.setOrigin(0.5, 0.5);

    this.scoreText = this.make.text({
      x: x - 154,
      y,
      text: `${scoreTitle}: ${this.score}`,
      style: { font: '32px monospace, sans-serif' },
    });
    this.timeText = this.make.text({
      x: x - 154,
      y: y + 50,
      text: `${timeTitle}: ${this.time}`,
      style: { font: '32px monospace, sans-serif' },
    });
    this.savingText = this.make.text({
      x,
      y: y + 150,
      text: gameOverText,
      style: { font: '22px monospace, sans-serif' },
    });
    this.savingText.setOrigin(0.5, 0.5);
  }

  switchOffHover(): void {
    this.saveBtn.on('pointerover', () => {
      this.hoverImg.setVisible(false);
    });
  }

  setMusic(): void {
    this.menu = this.scene.get('MenuScene');

    this.gameOverMusic = this.sound.add('gameOver-music');
    // @ts-ignore
    this.gameOverMusic.setLoop(true);
    // @ts-ignore
    if (this.menu.soundOn) this.gameOverMusic.play();
  }
}
