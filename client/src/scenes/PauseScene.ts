import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
  gameScene: Phaser.Scene;

  statusScene: Phaser.Scene;

  menuScene: Phaser.Scene;

  constructor() {
    super({ key: 'PauseScene' });
  }

  create(): void {
    this.gameScene = this.scene.get('GameScene');
    this.statusScene = this.scene.get('StatusScene');
    this.menuScene = this.scene.get('MenuScene');
    this.scene.moveAbove('PauseScene', 'StatusScene');
    this.scene.bringToTop();

    const { width, height } = this.gameScene.game.config;
    const contentHeight = 335;

    const background = this.add.renderTexture(0, 0, Number(width), Number(height));
    background.fill(0x000000, 0.65);

    const positionX = Number(this.game.config.width) / 2 - 75;
    const positionY = (Number(height) - contentHeight) / 2;
    // @ts-ignore
    const { hp } = this.gameScene.player;
    // @ts-ignore
    const { score } = this.gameScene;
    // @ts-ignore
    const { text: timeText } = this.statusScene.timeText;
    const infoFont = { font: '22px monospace, sans-serif' };

    const {
      timeTitle, scoreTitle, healthTitle, pauseState, finishState, resumeState,
      // @ts-ignore
    } = this.menuScene.currentLang.vocabulary;

    const title = this.add.text(positionX, positionY, pauseState, { font: '50px monospace, sans-serif' });
    const time = this.add.text(positionX, title.y + title.displayHeight + 20, `${timeTitle}: ${timeText}`, infoFont);
    const health = this.add.text(positionX, time.y + 25, `${healthTitle}: ${hp}`, infoFont);
    const points = this.add.text(positionX, health.y + 25, `${scoreTitle}: ${score}`, infoFont);
    const resumeBtn = this.add.image(positionX + 80, points.y + 100, 'btn').setInteractive()
      .on('pointerover', () => {
        resumeBtn.tintFill = false;
        resumeBtn.setTint(0xbababa);
      })
      .on('pointerout', () => {
        resumeBtn.clearTint();
      })
      .on('pointerup', () => {
        this.scene.stop();
        this.scene.resume('GameScene');
        this.scene.resume('StatusScene');
        this.statusScene.scene.bringToTop();
      });

    const resumeTxt = this.add.text(positionX + 80, points.y + 100, resumeState, {
      font: '30px monospace, sans-serif',
      color: '#212121',
    });
    resumeTxt.setOrigin(0.5, 0.5);
    const finishBtn = this.add.image(positionX + 80, resumeBtn.y + 80, 'btn').setInteractive()
      .on('pointerover', () => {
        finishBtn.tintFill = false;
        finishBtn.setTint(0xbababa);
      })
      .on('pointerout', () => {
        finishBtn.clearTint();
      })
      .on('pointerup', () => {
        this.scene.stop();
        this.scene.stop('StatusScene');
        this.scene.stop('GameScene');
        // @ts-ignore
        this.gameScene.gameMusic.stop();
        this.scene.start('GameOverScene');
      });

    const finishTxt = this.add.text(positionX + 80, resumeBtn.y + 80, finishState, {
      font: '30px monospace, sans-serif',
      color: '#212121',
    });
    finishTxt.setOrigin(0.5, 0.5);
  }
}
