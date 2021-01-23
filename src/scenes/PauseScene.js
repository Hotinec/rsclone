import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    this.gameScene = this.scene.get('GameScene');
    this.statusScene = this.scene.get('StatusScene');
    this.scene.moveAbove('PauseScene', this.statusScene);
    this.scene.bringToTop();

    // content
    const { width, height } = this.gameScene.game.config;
    const contentHeight = 335;

    const background = this.add.renderTexture(0, 0, width, height);
    background.fill(0x000000, 0.65);

    const positionX = this.game.config.width / 2 - 75;
    const positionY = (height - contentHeight) / 2;
    const { hp } = this.gameScene.player;
    const { score } = this.gameScene;
    const { text: timeText } = this.statusScene.timeText;
    const infoFont = { font: '22px monospace' };

    const title = this.add.text(positionX, positionY, 'PAUSE', { font: '50px monospace' });
    const time = this.add.text(positionX, title.y + title.displayHeight + 20, `Time: ${timeText}`, infoFont);
    const health = this.add.text(positionX, time.y + 25, `Health: ${hp}`, infoFont);
    const points = this.add.text(positionX, health.y + 25, `Score: ${score}`, infoFont);
    const resumeBtn = this.add.image(positionX + 80, points.y + 100, 'btn').setInteractive()
      .on('pointerover', () => {
        resumeBtn.alpha = 0.8;
      })
      .on('pointerout', () => {
        resumeBtn.alpha = 1;
      })
      .on('pointerup', () => {
        this.scene.stop();
        this.scene.resume('GameScene');
        this.scene.resume('StatusScene');
        this.statusScene.scene.bringToTop();
      });

    const resumeTxt = this.add.text(positionX + 80, points.y + 100, 'RESUME', {
      font: '30px monospace',
      color: '#212121',
    });
    resumeTxt.setOrigin(0.5, 0.5);
    const finishBtn = this.add.image(positionX + 80, resumeBtn.y + 80, 'btn').setInteractive()
      .on('pointerover', () => {
        finishBtn.alpha = 0.8;
      })
      .on('pointerout', () => {
        finishBtn.alpha = 1;
      })
      .on('pointerup', () => {
        this.scene.stop();
        this.scene.stop('StatusScene');
        this.scene.stop('GameScene');
        this.gameScene.gameMusic.stop();
        this.scene.start('GameOverScene');
      });

    const finishTxt = this.add.text(positionX + 80, resumeBtn.y + 80, 'FINISH', {
      font: '30px monospace',
      color: '#212121',
    });
    finishTxt.setOrigin(0.5, 0.5);
  }
}
