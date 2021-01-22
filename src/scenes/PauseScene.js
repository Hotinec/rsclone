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

    const background = this.add.renderTexture(0, 0, window.innerWidth, window.innerHeight);
    background.fill(0x000000, 0.65);

    // content
    const positionX = this.game.config.width / 2 - 75;
    const { hp } = this.gameScene.player;
    const { score } = this.gameScene;
    const { text: timeText } = this.statusScene.timeText;
    const infoFont = { font: '22px monospace' };

    const title = this.add.text(positionX, 250, 'PAUSE', { font: '50px monospace' });
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
  }
}
