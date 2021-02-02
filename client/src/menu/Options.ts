import Phaser from 'phaser';
import { IButton } from '../scenes/BaseScene';
import { MenuScene } from '../scenes';

export default class OptionsMenu {
  menu: MenuScene;

  x: number;

  y: number;

  volumeIndicatorsOn: [];

  volumeIndicatorsOff: [];

  title: IButton;

  backgroundWidth: number;

  backgroundHeight: number;

  background: Phaser.GameObjects.RenderTexture;

  fullScreen: Phaser.GameObjects.Text;

  volumeTitle: Phaser.GameObjects.Text;

  volumeBox: Phaser.GameObjects.Image;

  fullScreenBtn: { on: Phaser.GameObjects.Image; off: Phaser.GameObjects.Image; };

  language: Phaser.GameObjects.Text;

  lang: unknown;

  englBtn: { on: Phaser.GameObjects.Image; off: Phaser.GameObjects.Image; }

  backBtn: IButton;

  constructor(scene: MenuScene) {
    this.menu = scene;
    this.x = this.menu.game.renderer.width;
    this.y = this.menu.game.renderer.height;
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
  }

  init(): void {
    this.menu.hoverImg.setScale(0.3);
    this.createTitle();
    this.createBackground();
    this.createVolumeSet();
    this.createLangOpt();
    this.createFSOpt();
    this.createBackBtn();
    this.initClicks();
  }

  createTitle(): void {
    this.title = this.menu.add.image(this.x / 2,
      this.y * 0.1, 'title') as IButton;
    // @ts-ignore
    const { options } = this.menu.currentLang.vocabulary;

    this.title.textContent = this.menu.make.text(
      {
        x: this.x / 2,
        y: this.y * 0.1 + 7,
        text: options,
        style: {
          font: '40px monospace, sans-serif',
          color: '#212121',
        },
      },
    );
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
    const titleX = this.x / 2 - 145;
    // @ts-ignore
    const { fullScreen } = this.menu.currentLang.vocabulary;
    const { isFullscreen } = this.menu.scale;
    this.fullScreen = this.menu.add.text(titleX, y, fullScreen, { font: '26px monospace, sans-serif' });

    const btnX = titleX + 270;
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

  createLangOpt() :void {
    const y = this.y * 0.55;
    const titleX = this.x / 2 - 145;
    // @ts-ignore
    const { language } = this.menu.currentLang.vocabulary;
    // @ts-ignore
    const { lang } = this.menu.currentLang;

    const isEnglish = lang === 'en';
    this.language = this.menu.add.text(titleX, y, language, { font: '26px monospace, sans-serif' });

    const btnX = titleX + 270;

    this.englBtn = this.menu.createSwitchBtn({
      x: btnX,
      y: y + 10,
      onTexture: 'en-on',
      offTexture: 'ru-on',
      width: 45,
      height: 45,
      option: isEnglish,
    });
  }

  createVolumeSet(): void {
    const titleX = this.x / 2 - 145;
    const y = this.y * 0.35;
    // @ts-ignore
    const { volume } = this.menu.currentLang.vocabulary;

    this.volumeTitle = this.menu.add.text(
      titleX,
      y, volume, { font: '26px monospace, sans-serif' },
    );
    const boxX = this.x / 2 - 145 + 130;
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
    const width = this.volumeBox.x;
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
    // @ts-ignore
    const { back } = this.menu.currentLang.vocabulary;
    this.backBtn = this.menu.createBtn(x, y, back);
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

    this.englBtn.on.on('pointerdown', () => {
      this.englBtn.on.setVisible(false);
      this.englBtn.off.setVisible(true);
      this.setLanguage();
    });
    this.englBtn.off.on('pointerdown', () => {
      this.englBtn.on.setVisible(true);
      this.englBtn.off.setVisible(false);
      this.setLanguage();
    });

    this.backBtn.on('pointerdown', () => {
      this.removeOptionsMenu();
      this.menu.main.init();
    });

    this.volumeIndicatorsOff.forEach((el, idx) => {
      const btn: Phaser.GameObjects.Image = el;
      btn.on('pointerdown', () => {
        this.setVolumeUp(idx);
      });
    });

    this.volumeIndicatorsOn.forEach((el, idx) => {
      const btn: Phaser.GameObjects.Image = el;
      btn.on('pointerdown', () => {
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
      const btn: Phaser.GameObjects.Image = this.volumeIndicatorsOn[i];
      btn.setVisible(true);
    }
  }

  setVolumeDown(idx: number): void {
    const n = +`0.${idx}`;
    // @ts-ignore
    this.menu.sound.setVolume(n);

    for (let i = this.volumeIndicatorsOn.length - 1; idx <= i; i--) {
      const btn: Phaser.GameObjects.Image = this.volumeIndicatorsOn[i];
      btn.setVisible(false);
    }
  }

  setLanguage() : void {
    const { languages } = this.menu;
    // @ts-ignore
    const isEngl = this.menu.currentLang.lang === 'en';
    if (isEngl) {
      this.menu.prevLang = languages.en;
      this.menu.currentLang = languages.ru;
      this.menu.updateText();
    } else {
      this.menu.prevLang = languages.ru;
      this.menu.currentLang = languages.en;
      this.menu.updateText();
    }
  }

  destroyVolumeSet(): void {
    this.volumeIndicatorsOn.forEach((el) => {
      const btn: Phaser.GameObjects.Image = el;
      btn.destroy();
    });
    this.volumeIndicatorsOff.forEach((el) => {
      const btn: Phaser.GameObjects.Image = el;
      btn.destroy();
    });
  }

  removeOptionsMenu(): void {
    this.title.destroy();
    this.title.textContent.destroy();
    this.background.destroy();
    this.backBtn.destroy();
    this.backBtn.textContent.destroy();
    this.volumeBox.destroy();
    this.fullScreen.destroy();
    this.fullScreenBtn.on.destroy();
    this.fullScreenBtn.off.destroy();
    this.volumeTitle.destroy();
    this.menu.hoverImg.setVisible(false);
    this.language.destroy();
    this.englBtn.on.destroy();
    this.englBtn.off.destroy();
    this.destroyVolumeSet();
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
  }
}
