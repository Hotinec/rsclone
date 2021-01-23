import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
//   constructor(key) {
//     super(key);
//   }

  createBtn(x, y, text, button = 'btn') {
    const btn = this.add.image(x, y, button).setDepth(1);
    btn.textContent = this.make.text({
      x,
      y,
      text,
      style: {
        font: '27px monospace',
        fill: '#212121',
      },
    });
    btn.textContent.setOrigin(0.5, 0.5).setDepth(2);
    this.initHover(btn);

    return btn;
  }

  initHover(btn) {
    btn.setInteractive();

    btn.on('pointerover', () => {
      const currentBtn = btn;
      currentBtn.alpha = 0.8;
      this.hoverImg.setVisible(true);
      this.hoverImg.x = btn.x - this.hoverImg.width;
      this.hoverImg.y = btn.y;
    });

    btn.on('pointerout', () => {
      const currentBtn = btn;
      currentBtn.alpha = 1;
      this.hoverImg.setVisible(false);
    });
  }

  createBG(img = 'menu_bg') {
    const bg = this.add.image(0, 0, img).setDepth(0);
    const { width, height } = this.game.config;
    bg.displayHeight = height;
    bg.scaleX = bg.scaleY;

    bg.y = height / 2;
    bg.x = width / 2;

    // bg.x = bg.displayWidth*.5
  }

  setMusic() {
    this.audio = this.sound.add('theme');
    this.audio.setLoop(true);
  }

  setHoverImg() {
    this.hoverImg = this.add.image(100, 100, 'scull');
    this.hoverImg.setVisible(false);
    this.hoverImg.setScale(0.4);
  }
}
