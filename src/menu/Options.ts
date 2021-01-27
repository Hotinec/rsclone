/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import Phaser from 'phaser';
import { MenuScene } from '../scenes';

export default class OptionsMenu {
  menu: MenuScene;

  x: number;

  y: number;

  btnsTexts: [];

  volumeIndicatorsOn: [];

  volumeIndicatorsOff: [];

  title: Phaser.GameObjects.Image;

  backgroundWidth: number;

  backgroundHeight: number;

  background: Phaser.GameObjects.RenderTexture;

  fullScreen: Phaser.GameObjects.Text;

  volumeTitle: Phaser.GameObjects.Text;

  volumeBox: Phaser.GameObjects.Image;

  fullScreenBtn: { on: Phaser.GameObjects.Image; off: Phaser.GameObjects.Image; };

  backBtn: Phaser.GameObjects.Image;

  constructor(scene: MenuScene) {
    this.menu = scene;
    this.x = this.menu.game.renderer.width;
    this.y = this.menu.game.renderer.height;
    this.btnsTexts = [];
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
  }

  init(): void {
    this.menu.hoverImg.setScale(0.3);
    this.createTitle();
    this.createBackground();
    this.createVolumeSet();
    this.createFSOpt();
    this.createBackBtn();
    this.initClicks();
  }

  createTitle(): void {
    this.title = this.menu.add.image(this.x / 2,
      this.y * 0.1, 'title');
    // @ts-ignore
    this.title.textContent = this.menu.make.text(
      {
        x: this.x / 2,
        y: this.y * 0.1 + 7,
        text: 'Options',
        style: {
          font: '40px monospace',
          // @ts-ignore
          fill: '#212121',
        },
      },
    );
    // @ts-ignore
    this.title.textContent.setOrigin(0.5, 0.1).setDepth(2);
  }

  createBackground(): void {
    let x;
    if (this.x < 500) {
      this.backgroundWidth = this.x;
      x = 0;
    } else {
      this.backgroundWidth = this.x - this.x / 3;
      x = this.x / 6;
    }
    this.backgroundHeight = this.y - this.y * 0.4;

    this.background = this.menu.add.renderTexture(x,
      this.y * 0.2, this.backgroundWidth, this.backgroundHeight);
    this.background.fill(0x000000, 0.65);
  }

  createFSOpt(): void {
    const y = this.y * 0.45;
    const titleX = this.x / 2 - 140;

    const { isFullscreen } = this.menu.scale;
    this.fullScreen = this.menu.add.text(titleX, y, 'Fullscreen', { font: '26px monospace' });

    const btnX = titleX + this.fullScreen.displayWidth + 100;
    this.fullScreenBtn = this.menu.createSwitchBtn({
      x: btnX,
      y: y + 10,
      onTexture: 'full-on',
      offTexture: 'full-off',
      width: 45,
      height: 45,
      option: !isFullscreen,
    });
  }

  createVolumeSet(): void {
    const titleX = this.x / 2 - 140;
    const y = this.y * 0.35;

    this.volumeTitle = this.menu.add.text(
      titleX,
      y, 'Volume', { font: '26px monospace' },
    );

    const boxX = this.x / 2 - 140 + this.volumeTitle.displayWidth;
    // @ts-ignore
    this.volumeBox = this.menu.add.image(boxX, y);
    this.volumeBox.displayWidth = 50;
    this.volumeBox.displayHeight = 20;
    this.volumeBox.setOrigin(0.5, 0.5);
    this.createVolumeIndicator(y);
  }

  createVolumeIndicator(y: number): void {
    for (let i = 0; i < 5; i++) {
      this.createVolumeRange(y, i, 'empty-scull', this.volumeIndicatorsOff);
      this.createVolumeRange(y, i, 'scull', this.volumeIndicatorsOn);
    }
  }

  createVolumeRange(y: number, i: number, btn: string, arr: Phaser.GameObjects.Image[]): void {
    const width = this.volumeBox.x + this.volumeBox.width / 2;
    const img: Phaser.GameObjects.Image = this.menu.add.image(100, 100, btn).setDepth(3);
    const x = width + img.width * 0.2 * i + img.width * 0.2;
    img.setScale(0.25);
    img.x = x;
    img.y = y + 13;
    // @ts-ignore
    img.id = i;
    img.setInteractive();
    arr.push(img);
  }

  createBackBtn(): void {
    const x = this.x / 2;
    const y = this.y * 0.2 + this.backgroundHeight - 60;
    this.backBtn = this.menu.createBtn(x, y, 'Back');
  }

  initClicks(): void {
    this.fullScreenBtn.on.on('pointerdown', () => {
      this.menu.scale.startFullscreen();
      this.fullScreenBtn.on.setVisible(false);
      this.fullScreenBtn.off.setVisible(true);
    });
    this.fullScreenBtn.off.on('pointerdown', () => {
      this.menu.scale.stopFullscreen();
      this.fullScreenBtn.on.setVisible(true);
      this.fullScreenBtn.off.setVisible(false);
    });

    this.backBtn.on('pointerdown', () => {
      this.removeOptionsMenu();
      this.menu.main.init();
    });

    this.volumeIndicatorsOff.forEach((el, idx) => {
      // @ts-ignore
      el.on('pointerdown', () => {
        this.setVolumeUp(idx);
      });
    });

    this.volumeIndicatorsOn.forEach((el, idx) => {
      // @ts-ignore
      el.on('pointerdown', () => {
        this.setVolumeDown(idx);
      });
    });
  }

  setVolumeUp(idx: number): void {
    const n = +`0.${idx}`;
    // @ts-ignore
    this.menu.game.volume = n;
    // @ts-ignore
    this.menu.sound.setVolume(n);

    for (let i = 0; i <= idx; i++) {
      // @ts-ignore
      this.volumeIndicatorsOn[i].setVisible(true);
    }
  }

  setVolumeDown(idx: number): void {
    const n = +`0.${idx}`;
    // @ts-ignore
    this.menu.sound.setVolume(n);

    for (let i = this.volumeIndicatorsOn.length - 1; idx <= i; i--) {
      // @ts-ignore
      this.volumeIndicatorsOn[i].setVisible(false);
    }
  }

  removeOptionsMenu(): void {
    this.title.destroy();
    // @ts-ignore
    this.title.textContent.destroy();
    this.background.destroy();
    this.backBtn.destroy();
    // @ts-ignore
    this.backBtn.textContent.destroy();
    this.volumeBox.destroy();
    this.fullScreen.destroy();
    this.fullScreenBtn.on.destroy();
    this.fullScreenBtn.off.destroy();
    this.volumeTitle.destroy();
    this.menu.hoverImg.setVisible(false);
    // @ts-ignore
    this.volumeIndicatorsOn.forEach((el) => el.destroy());
    // @ts-ignore
    this.volumeIndicatorsOff.forEach((el) => el.destroy());
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
  }
}
