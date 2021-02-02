import Phaser from 'phaser';
import { IButton } from '../scenes/BaseScene';
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

  playBtn: IButton;

  aboutBtn: IButton;

  soundBtn: { on: Phaser.GameObjects.Image; off: Phaser.GameObjects.Image; };

  bestSoresBtn: IButton;

  optionsBtn: IButton;

  logo: Phaser.GameObjects.Image;

  dialogBackground: Phaser.GameObjects.RenderTexture;

  box: Phaser.GameObjects.RenderTexture;

  close: Phaser.GameObjects.Image;

  dialogTitle: Phaser.GameObjects.Text;

  theme1Text: Phaser.GameObjects.Text;

  theme2: Phaser.GameObjects.RenderTexture;

  theme2Text: Phaser.GameObjects.Text;

  okBtn: IButton;

  theme: string | undefined;

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

    const {
      newGame, options, bestScore, about,
      // @ts-ignore
    } = this.menu.currentLang.vocabulary;
    const { width, height } = this.menu.game.config;
    const { audio } = this.menu;

    const x: number = +width / 2;
    const y: number = +height * 0.35;

    this.playBtn = this.menu.createBtn(x, y + 50, newGame);
    this.optionsBtn = this.menu.createBtn(x, y + 170, options);
    this.aboutBtn = this.menu.createBtn(x, y + 110, about);
    this.bestSoresBtn = this.menu.createBtn(x, y + 230, bestScore);
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

    this.aboutBtn.on('pointerdown', () => {
      this.removeMainMenu();
      this.menu.about.init();
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
    const { width, height } = this.menu.game.config;
    this.logo = this.menu.add.image(+width / 2, +height * 0.20, 'logo').setDepth(1);

    if (width < 650) {
      this.logo.setScale(0.4);
    } else if (width < 750) {
      this.logo.setScale(0.5);
    } else if (width < 950) {
      this.logo.setScale(0.6);
    } else if (width < 1200) {
      this.logo.setScale(0.8);
    }
  }

  createDialog(): void {
    this.removeMainMenu();

    const { width, height } = this.menu.game.config;
    // @ts-ignore
    const { chooseTheme, darkTheme, lightTheme } = this.menu.currentLang.vocabulary;

    this.dialogBackground = this.menu.add.renderTexture(0, 0, Number(width), Number(height));
    this.dialogBackground.fill(0x000000, 0.65).setDepth(7);

    const x = Number(width) / 2 - 200;
    const y = Number(height) / 2 - 200;
    this.box = this.menu.add.renderTexture(x, y, 400, 400);
    this.box.fill(0x000000, 0.5).setDepth(8);

    this.close = this.menu.add.image(x + 358, y + 10, 'close')
      .setDepth(9)
      .setOrigin(0, 0)
      .setInteractive();

    this.menu.initHover(this.close, true);

    this.dialogTitle = this.menu.add.text(x + 200, y + 80,
      chooseTheme,
      { font: '26px monospace, sans-serif' })
      .setOrigin(0.5, 0.5)
      .setDepth(9);

    const font = { font: '22px monospace, sans-serif' };
    this.theme1 = this.menu.add.renderTexture(x + 40, y + 150, 320, 50);
    this.theme1.fill(0xffffff, 0.15).setDepth(9).setInteractive();
    this.theme1Text = this.menu.add.text(x + 200, y + 165, darkTheme, font)
      .setOrigin(0.5, 0)
      .setDepth(10);

    this.theme2 = this.menu.add.renderTexture(x + 40, y + 220, 320, 50);
    this.theme2.fill(0xffffff, 0.15).setDepth(9).setInteractive();
    this.theme2Text = this.menu.add.text(x + 200, y + 232, lightTheme, font)
      .setOrigin(0.5, 0)
      .setDepth(10);

    this.okBtn = this.menu.createBtn(x + 200, y + 340, 'OK').setDepth(10);
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
      this.theme = undefined;
    }
  }

  dialogEvents(): void {
    if (this.theme1) {
      this.theme1.on('pointerover', () => {
        // @ts-ignore
        this.theme1.tintFill = false;
        // @ts-ignore
        this.theme1.setTint(0X919191);
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
      this.theme2.setTint(0X919191);
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
      if (this.theme !== undefined) {
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
    this.okBtn.textContent.destroy();
  }

  removeMainMenu(): void {
    this.logo.destroy();
    this.playBtn.destroy();
    this.playBtn.textContent.destroy();
    this.soundBtn.on.destroy();
    this.soundBtn.off.destroy();
    this.aboutBtn.destroy();
    this.aboutBtn.textContent.destroy();
    this.bestSoresBtn.destroy();
    this.bestSoresBtn.textContent.destroy();
    this.optionsBtn.destroy();
    this.optionsBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
