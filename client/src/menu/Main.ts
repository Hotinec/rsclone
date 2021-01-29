/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/extensions */
import Phaser from 'phaser';
import { MenuScene } from '../scenes/MenuScene';
import { THEME } from '../constants';

interface IThemeOptions {
  themeName: string;
  active: Phaser.GameObjects.RenderTexture | null;
  inactive: Phaser.GameObjects.RenderTexture;
  activeTxt: Phaser.GameObjects.Text;
  inactiveTxt: Phaser.GameObjects.Text;
}

export default class MainMenu {
  menu: MenuScene;

  theme1: Phaser.GameObjects.RenderTexture | null;

  playBtn: Phaser.GameObjects.Image;

  aboutBtn: Phaser.GameObjects.Image;

  soundBtn: { on: Phaser.GameObjects.Image; off: Phaser.GameObjects.Image; };

  bestSoresBtn: Phaser.GameObjects.Image;

  optionsBtn: Phaser.GameObjects.Image;

  logo: Phaser.GameObjects.Image;

  dialogBackground: Phaser.GameObjects.RenderTexture;

  box: Phaser.GameObjects.RenderTexture;

  close: Phaser.GameObjects.Image;

  dialogTitle: Phaser.GameObjects.Text;

  theme1Text: Phaser.GameObjects.Text;

  theme2: Phaser.GameObjects.RenderTexture;

  theme2Text: Phaser.GameObjects.Text;

  okBtn: Phaser.GameObjects.Image;

  theme: string | null;

  constructor(scene: MenuScene) {
    this.menu = scene;
    this.theme1 = null;
  }

  init(): void {
    this.createMainMenu();
    this.initClicks();
  }

  createMainMenu(): void {
    this.createLogo();

    const { width, height } = this.menu.game.config;
    const { audio } = this.menu;

    // @ts-ignore
    const x = width / 2;
    // @ts-ignore
    const y = height / 2;

    this.playBtn = this.menu.createBtn(x, y + 50, 'New Game');
    this.optionsBtn = this.menu.createBtn(x, y + 170, 'Options');
    this.aboutBtn = this.menu.createBtn(x, y + 110, 'About');
    this.bestSoresBtn = this.menu.createBtn(x, y + 230, 'Best Scores');
    this.soundBtn = this.menu.createSwitchBtn(
      {
        x,
        y: y + 290,
        onTexture: 'unmute',
        offTexture: 'mute',
        width: 55,
        height: 55,
        option: audio.isPlaying,
      },
    );
  }

  initClicks(): void {
    this.playBtn.on('pointerdown', () => {
      this.menu.audio.stop();
      this.createDialog();
    });
    this.optionsBtn.on('pointerdown', () => {
      this.removeMainMenu();
      this.menu.options.init();
    });

    this.bestSoresBtn.on('pointerdown', () => {
      this.removeMainMenu();
      this.menu.score.init();
    });

    this.soundBtn.off.on('pointerdown', () => {
      if (!this.menu.audio.isPlaying) {
        this.menu.audio.play();
        this.menu.soundOn = true;
        this.soundBtn.off.setVisible(false);
        this.soundBtn.on.setVisible(true);
        return;
      }
      this.menu.soundOn = true;
      // @ts-ignore
      this.menu.sound.setMute(false);
      this.soundBtn.off.setVisible(false);
      this.soundBtn.on.setVisible(true);
    });
    this.soundBtn.on.on('pointerdown', () => {
      // @ts-ignore
      this.menu.sound.setMute(true);
      this.menu.soundOn = false;
      this.soundBtn.off.setVisible(true);
      this.soundBtn.on.setVisible(false);
    });
  }

  createLogo(): void {
    const maxWidth = 1400;
    const middleWidth = 1000;
    const { width, height } = this.menu.game.config;
    // @ts-ignore
    this.logo = this.menu.add.image(width / 2, height * 0.20, 'logo').setDepth(1);

    if (width < maxWidth && width > middleWidth) {
      this.logo.scaleX = this.logo.scaleY * 0.8;
    }

    if (maxWidth < middleWidth) {
      this.logo.scaleX = this.logo.scaleY * 0.7;
    }
  }

  createDialog(): void {
    this.removeMainMenu();

    const { width, height } = this.menu.game.config;
    // @ts-ignore
    this.dialogBackground = this.menu.add.renderTexture(0, 0, width, height);
    this.dialogBackground.fill(0x000000, 0.65).setDepth(7);
    // @ts-ignore
    const x = width / 2 - 200;
    // @ts-ignore
    const y = height / 2 - 200;
    this.box = this.menu.add.renderTexture(x, y, 400, 400);
    this.box.fill(0x000000, 0.5).setDepth(8);

    this.close = this.menu.add.image(x + 358, y + 10, 'close')
      .setDepth(9)
      .setOrigin(0, 0)
      .setInteractive();

    this.menu.initHover(this.close, true);

    this.dialogTitle = this.menu.add.text(x + 200, y + 80,
      'Choose the game theme',
      { font: '26px monospace' })
      .setOrigin(0.5, 0.5)
      .setDepth(9);

    const font = { font: '22px monospace' };
    this.theme1 = this.menu.add.renderTexture(x + 40, y + 150, 320, 50);
    this.theme1.fill(0xffffff, 0.15).setDepth(9).setInteractive();
    this.theme1Text = this.menu.add.text(x + 200, y + 165, 'Dark theme', font)
      .setOrigin(0.5, 0)
      .setDepth(10);

    this.theme2 = this.menu.add.renderTexture(x + 40, y + 220, 320, 50);
    this.theme2.fill(0xffffff, 0.15).setDepth(9).setInteractive();
    this.theme2Text = this.menu.add.text(x + 200, y + 232, 'Light theme', font)
      .setOrigin(0.5, 0)
      .setDepth(10);

    this.okBtn = this.menu.createBtn(x + 200, y + 340, 'OK').setDepth(10);
    // @ts-ignore
    this.okBtn.textContent.setDepth(11);
    this.dialogEvents();
  }

  changeTheme(options: IThemeOptions): void {
    const {
      themeName, active, inactive, activeTxt, inactiveTxt,
    } = options;
    if (this.theme !== themeName) {
      if (active) {
        active.tintFill = false;
        // @ts-ignore
        active.setTint('#919191');
      }
      activeTxt.setStyle({ color: '#969696' });
      this.theme = themeName;
      inactive.clearTint();
      inactiveTxt.setStyle({ color: '#ffffff' });
    } else {
      if (active) active.clearTint();
      activeTxt.setStyle({ color: '#ffffff' });
      this.theme = null;
    }
  }

  dialogEvents(): void {
    if (this.theme1) {
      this.theme1.on('pointerover', () => {
        // @ts-ignore
        this.theme1.tintFill = false;
        // @ts-ignore
        this.theme1.setTint('#919191');
      });
      this.theme1.on('pointerout', () => {
        if (this.theme !== THEME.BLACK) {
          if (this.theme1) this.theme1.clearTint();
        }
      });
      this.theme1.on('pointerdown', () => {
        this.changeTheme({
          themeName: THEME.BLACK,
          active: this.theme1,
          inactive: this.theme2,
          activeTxt: this.theme1Text,
          inactiveTxt: this.theme2Text,
        });
      });
    }
    this.theme2.on('pointerover', () => {
      this.theme2.tintFill = false;
      // @ts-ignore
      this.theme2.setTint('#919191');
    });
    this.theme2.on('pointerout', () => {
      if (this.theme !== THEME.LIGHT) {
        this.theme2.clearTint();
      }
    });
    this.theme2.on('pointerdown', () => {
      this.changeTheme({
        themeName: THEME.LIGHT,
        active: this.theme2,
        // @ts-ignore
        inactive: this.theme1,
        activeTxt: this.theme2Text,
        inactiveTxt: this.theme1Text,
      });
    });
    this.okBtn.on('pointerup', () => {
      if (this.theme !== null) {
        // @ts-ignore
        this.menu.scene.start('LoadScene', this.theme);
      }
    });
    this.close.on('pointerup', () => {
      this.removeDialog();
      this.init();
    });
  }

  removeDialog(): void {
    this.dialogBackground.destroy();
    this.box.destroy();
    this.close.destroy();
    this.dialogTitle.destroy();
    if (this.theme1) this.theme1.destroy();
    this.theme2.destroy();
    this.theme1Text.destroy();
    this.theme2Text.destroy();
    this.okBtn.destroy();
    // @ts-ignore
    this.okBtn.textContent.destroy();
  }

  removeMainMenu(): void {
    this.logo.destroy();
    this.playBtn.destroy();
    // @ts-ignore
    this.playBtn.textContent.destroy();
    this.soundBtn.on.destroy();
    this.soundBtn.off.destroy();
    this.aboutBtn.destroy();
    // @ts-ignore
    this.aboutBtn.textContent.destroy();
    this.bestSoresBtn.destroy();
    // @ts-ignore
    this.bestSoresBtn.textContent.destroy();
    this.optionsBtn.destroy();
    // @ts-ignore
    this.optionsBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
