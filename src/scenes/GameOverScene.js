import InputText from 'phaser3-rex-plugins/plugins/inputtext';
import Phaser from 'phaser';

import BaseScene from './BaseScene';

export class GameOverScene extends BaseScene {
  constructor() {
    super({ key: 'GameOverScene' });
    this.results = GameOverScene.getResults();
  }

  create() {
    const { width, height } = this.game.config;
    this.getScore();
    this.setMusic();
    this.createBG();
    const background = this.add.renderTexture(0, 0, width, height);
    background.fill(0x000000, 0.65);
    this.setHoverImg();
    this.getInput();
    this.getDate();
    this.initKeyEvents();
    this.initClickEvents();
    this.switchOffHover();
    this.setTextContent();
  }

  static getResults() {
    const resultsArr = localStorage.getItem('results');

    if (resultsArr) return JSON.parse(resultsArr);

    return [];
  }

  getScore() {
    this.gameScene = this.scene.get('GameScene');
    const statusScene = this.scene.get('StatusScene');
    const { text: timeText } = statusScene.timeText;
    const { score } = this.gameScene;
    this.score = score;
    this.time = timeText;
  }

  saveResult() {
    const resultsJson = JSON.stringify(this.results);
    localStorage.setItem('results', resultsJson);
  }

  getInput() {
    const {
      nameTitle, save, mainMenu,
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
      fontFamily: 'monospace',
      color: '#000000',
      border: '3px solid',
      backgroundColor: '#e6e6e6',
      borderColor: '#9c9f9e',
      outline: 'none',
    };

    const { width, height } = this.game.config;
    const y = height * 0.4 + 200;

    this.inputText = new InputText(this, width / 2, y, 270, 40, config);
    this.add.existing(this.inputText);
    this.inputText.setOrigin(0.8, 0.5);

    const x = (width + this.inputText.displayWidth) / 2 + 5;
    this.saveBtn = this.createBtn(x, y + 3, save);
    this.saveBtn.displayWidth = 150;

    const btnY = y + this.inputText.height + 25;
    this.mainMenuBtn = this.createBtn(width / 2, btnY, mainMenu);
  }

  initKeyEvents() {
    this.keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyObj.on('down', () => {
      if (this.inputText.text === '') return;
      this.setResult();
      this.saveResult();
      this.inputText.text = '';
      this.gameOverMusic.stop();
      this.scene.start('MenuScene');
    });
  }

  initClickEvents() {
    this.saveBtn.on('pointerdown', () => {
      this.setResult();
      this.saveResult();
      this.inputText.text = '';
      this.gameOverMusic.stop();
      this.scene.start('MenuScene');
    });

    this.mainMenuBtn.on('pointerdown', () => {
      this.gameOverMusic.stop();
      this.scene.start('MenuScene');
    });
  }

  setResult() {
    const result = {
      name: this.inputText.text,
      time: this.time,
      score: this.score,
      date: this.date,
    };
    this.results.push(result);
  }

  getDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    this.date = `${day}/${month + 1}/${year}`;
  }

  setTextContent() {
    const { width, height } = this.game.config;
    const {
      gameOverText, gameOverState, scoreTitle, timeTitle,
    } = this.menu.currentLang.vacabluary;
    const x = width / 2;
    const y = height * 0.4;

    const title = this.add.text(x, height * 0.3, gameOverState, { font: '46px monospace' });
    title.setOrigin(0.5, 0.5);

    this.scoreText = this.make.text({
      x: x - 154,
      y,
      text: `${scoreTitle}: ${this.score}`,
      style: { font: '32px monospace' },
    });
    this.timeText = this.make.text({
      x: x - 154,
      y: y + 50,
      text: `${timeTitle}: ${this.time}`,
      style: { font: '32px monospace' },
    });
    this.savingText = this.make.text({
      x,
      y: y + 150,
      text: gameOverText,
      style: { font: '22px monospace' },
    });
    this.savingText.setOrigin(0.5, 0.5);
  }

  switchOffHover() {
    this.saveBtn.on('pointerover', () => {
      this.hoverImg.setVisible(false);
    });
  }

  setMusic() {
    this.menu = this.scene.get('MenuScene');

    this.gameOverMusic = this.sound.add('gameOver-music');
    this.gameOverMusic.setLoop(true);
    if (this.menu.soundOn) this.gameOverMusic.play();
  }
}
