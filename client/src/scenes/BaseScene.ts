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
export interface IButton extends Phaser.GameObjects.Image{
  textContent: Phaser.GameObjects.Text;
}

export default class BaseScene extends Phaser.Scene {
  hoverImg: Phaser.GameObjects.Image;

  audio: Phaser.Sound.BaseSound;

  createBtn(x: number, y: number, text: string, button = 'btn'): IButton {
    const btn = this.add.image(x, y, button).setDepth(1) as IButton;
    btn.textContent = this.make.text({
      x,
      y,
      text,
      style: {
        font: '27px monospace, sans-serif',
        color: '#212121',
      },
    });
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

  createBG(): void {
    const { width, height } = this.sys.game.config;
    const widthNum = Number(width);
    const heightNum = Number(height);
    const distortedRatio = widthNum / heightNum > 1.8;

    const video:Phaser.GameObjects.Video = this.add.video(-20, -20, 'background');
    video.setOrigin(0, 0);
    video.setDisplaySize(widthNum + 40, heightNum + 30);
    if (distortedRatio) {
      video.scaleY = video.scaleX;
    } else {
      video.scaleX = video.scaleY;
    }
    video.play(true);
    video.setPaused(false);
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
