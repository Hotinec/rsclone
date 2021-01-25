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
    const background = this.add.renderTexture(0, 0, width, height);
    background.fill(0x000000, 1);
    this.getScore();
    this.setMusic();
    this.createBG();
    this.setHoverImg();
    this.getInput();
    this.getDate();
    this.initInputEvents();
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
    const config = {
      maxLength: 15,
      minLength: 1,
      placeholder: 'Enter your name',
      paddingLeft: 10,
      paddingRight: 0,
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 30,
      color: '#ffffff',
      border: 1,
      backgroundColor: '#212121',
      borderColor: '#eeeeee',
    };

    const { width, height } = this.game.config;

    this.inputText = new InputText(this, width / 2, height * 0.3 + 150, 400, 50, config);
    this.add.existing(this.inputText);
    this.inputText.setOrigin(0.7, 0.5);
    this.saveBtn = this.createBtn(width / 2, height * 0.3 + 153, '', 'save-btn');
    this.saveBtn.x = width / 2 + this.inputText.width - this.saveBtn.width + 20;
    this.saveBtn.setOrigin(0.7, 0.5);
  }

  initInputEvents() {
    this.keyObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyObj.on('down', () => {
      this.setResult();
      this.saveResult();
      this.inputText.text = '';
      this.gameOverMusic.stop();
      this.scene.start('MenuScene');
    });

    this.saveBtn.on('pointerdown', () => {
      this.setResult();
      this.saveResult();
      this.inputText.text = '';
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
    const shadow = {
      offsetX: 4,
      offsetY: -3,
      color: '#000000',
      blur: 5,
      fill: true,
    };
    const fill = '#ffffff';
    const { width, height } = this.game.config;

    this.scoreText = this.make.text({
      x: width / 2,
      y: height * 0.3,
      text: `Score: ${this.score}`,
      style: { font: '50px monospace', fill, shadow },
    });
    this.scoreText.setOrigin(0.5, 0.5);

    this.timeText = this.make.text({
      x: width / 2,
      y: height * 0.3 + 50,
      text: `Time: ${this.time}`,
      style: { font: '50px monospace', fill, shadow },
    });
    this.timeText.setOrigin(0.5, 0.5);

    this.savingText = this.make.text({
      x: width / 2,
      y: height * 0.3 + 100,
      text: 'Enter your name to save a result',
      style: { font: '30px monospace', fill, shadow },
    });
    this.savingText.setOrigin(0.5, 0.5);
  }

  switchOffHover() {
    this.saveBtn.on('pointerover', () => {
      this.hoverImg.setVisible(false);
    });
  }

  setMusic() {
    const menu = this.scene.get('MenuScene');

    this.gameOverMusic = this.sound.add('gameOver-music');
    this.gameOverMusic.setLoop(true);
    if (menu.soundOn) this.gameOverMusic.play();
  }
}
