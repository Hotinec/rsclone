import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
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
    this.initHover(btn, false);
    return btn;
  }

  createSwitchBtn(settings) {
    const {
      x, y, onTexture, offTexture, width, height, option,
    } = settings;
    const createBtn = (texture) => {
      const bttn = this.add.image(x, y, texture).setDepth(1);
      bttn.displayWidth = width;
      bttn.displayHeight = height;
      this.initHover(bttn, true);
      return bttn;
    };
    const on = createBtn(onTexture);
    const off = createBtn(offTexture);

    if (option) {
      on.setVisible(true);
      off.setVisible(false);
    } else {
      off.setVisible(true);
      on.setVisible(false);
    }
    return { on, off };
  }

  initHover(btn, isSwitch) {
    btn.setInteractive();

    btn.on('pointerover', () => {
      const currentBtn = btn;
      currentBtn.tintFill = false;
      currentBtn.setTint('0xbababa');
      if (!isSwitch) {
        this.hoverImg.setVisible(true);
        this.hoverImg.setDepth(15);
        this.hoverImg.x = btn.x - this.hoverImg.width;
        this.hoverImg.y = btn.y;
      }
    });

    btn.on('pointerout', () => {
      const currentBtn = btn;
      currentBtn.clearTint();
      if (!isSwitch) {
        this.hoverImg.setVisible(false);
      }
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
