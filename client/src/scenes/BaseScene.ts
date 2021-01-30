import Phaser from 'phaser';

interface ISettings {
  x: number;
  y: number;
  onTexture: string;
  offTexture: string;
  width: number;
  height: number;
  option: boolean;
}

export default class BaseScene extends Phaser.Scene {
  hoverImg: Phaser.GameObjects.Image;

  audio: Phaser.Sound.BaseSound;

  //   constructor(key) {
  //     super(key);
  //   }

  createBtn(x: number, y: number, text: string, button = 'btn'): Phaser.GameObjects.Image {
    const btn: Phaser.GameObjects.Image = this.add.image(x, y, button).setDepth(1);
    // @ts-ignore
    btn.textContent = this.make.text({
      x,
      y,
      text,
      style: {
        font: '27px monospace',
        // @ts-ignore
        fill: '#212121',
      },
    });
    // @ts-ignore
    btn.textContent.setOrigin(0.5, 0.5).setDepth(2);
    this.initHover(btn, false);
    return btn;
  }

  createSwitchBtn(settings: ISettings):
  { on: Phaser.GameObjects.Image, off: Phaser.GameObjects.Image } {
    const {
      x, y, onTexture, offTexture, width, height, option,
    } = settings;
    const createBtn = (texture: string) => {
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

  initHover(btn: Phaser.GameObjects.Image, isSwitch: boolean): void {
    btn.setInteractive();

    btn.on('pointerover', () => {
      const currentBtn = btn;
      currentBtn.tintFill = false;
      currentBtn.setTint(0xbababa);
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

  createBG(img = 'menu_bg'): void {
    const bg: Phaser.GameObjects.Image = this.add.image(0, 0, img).setDepth(0);
    const { width, height } = this.game.config;
    // @ts-ignore
    bg.displayHeight = height;
    bg.scaleX = bg.scaleY;

    // @ts-ignore
    bg.y = height / 2;
    // @ts-ignore
    bg.x = width / 2;

    // bg.x = bg.displayWidth*.5
  }

  setMusic(): void {
    this.audio = this.sound.add('theme');
    // @ts-ignore
    this.audio.setLoop(true);
  }

  setHoverImg(): void {
    this.hoverImg = this.add.image(100, 100, 'scull');
    this.hoverImg.setVisible(false);
    this.hoverImg.setScale(0.4);
  }
}
