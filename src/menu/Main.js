export default class MainMenu {
  constructor(scene) {
    this.menu = scene;
    this.theme1 = null;
  }

  init() {
    this.createMainMenu();
    this.initClicks();
  }

  createMainMenu() {
    this.createLogo();

    const { width, height } = this.menu.game.config;
    const { audio } = this.menu;

    this.playBtn = this.menu.createBtn(width / 2, height / 2 + 50, 'New Game');
    this.aboutBtn = this.menu.createBtn(width / 2, height / 2 + 110, 'About');
    this.optionsBtn = this.menu.createBtn(width / 2, height / 2 + 170, 'Options');
    this.soundBtn = this.menu.createSwitchBtn(
      {
        x: width / 2,
        y: height / 2 + 230,
        onTexture: 'unmute',
        offTexture: 'mute',
        width: 55,
        height: 55,
        option: audio.isPlaying,
      },
    );
  }

  initClicks() {
    this.playBtn.on('pointerdown', () => {
      this.menu.audio.stop();
      this.createDialog();
      // this.menu.scene.start('LoadScene');
    });
    this.optionsBtn.on('pointerdown', () => {
      this.removeMainMenu();
      this.menu.options.init();
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
      this.menu.sound.setMute(false);
      this.soundBtn.off.setVisible(false);
      this.soundBtn.on.setVisible(true);
    });
    this.soundBtn.on.on('pointerdown', () => {
      this.menu.sound.setMute(true);
      this.menu.soundOn = false;
      this.soundBtn.off.setVisible(true);
      this.soundBtn.on.setVisible(false);
    });
  }

  createLogo() {
    const maxWidth = 1400;
    const middleWidth = 1000;
    const { width, height } = this.menu.game.config;
    this.logo = this.menu.add.image(width / 2, height * 0.20, 'logo').setDepth(1);

    if (width < maxWidth && width > middleWidth) {
      this.logo.scaleX = this.logo.scaleY * 0.8;
    }

    if (maxWidth < middleWidth) {
      this.logo.scaleX = this.logo.scaleY * 0.7;
    }
  }

  createDialog() {
    this.removeMainMenu();

    const { width, height } = this.menu.game.config;
    this.dialogBackground = this.menu.add.renderTexture(0, 0, width, height);
    this.dialogBackground.fill(0x000000, 0.65).setDepth(7);
    const x = width / 2 - 200;
    const y = height / 2 - 200;
    this.box = this.menu.add.renderTexture(x, y, 400, 400);
    this.box.fill(0x000000, 0.5).setDepth(8);

    this.close = this.menu.add.image(x + 358, y + 10, 'close').setDepth(9).setOrigin(0, 0).setInteractive();

    this.dialogTitle = this.menu.add.text(x + 200, y + 80, 'Choose the game theme', { font: '26px monospace' }).setOrigin(0.5, 0.5).setDepth(9);
    this.theme1 = this.menu.add.renderTexture(x + 40, y + 150, 320, 50);
    this.theme1.fill(0xffffff, 0.15).setDepth(9).setInteractive();
    this.theme2 = this.menu.add.renderTexture(x + 40, y + 220, 320, 50);
    this.theme2.fill(0xffffff, 0.15).setDepth(9).setInteractive();
    this.theme1Text = this.menu.add.text(x + 200, y + 165, 'Dark theme', { font: '22px monospace' }).setOrigin(0.5, 0).setDepth(10);
    this.theme2Text = this.menu.add.text(x + 200, y + 232, 'Light theme', { font: '22px monospace' }).setOrigin(0.5, 0).setDepth(10);

    this.okBtn = this.menu.createBtn(x + 200, y + 340, 'OK').setDepth(10);
    this.okBtn.textContent.setDepth(11);
    this.dialogEvents();
  }

  changeTheme(options) {
    const {
      themeName, active, inactive, activeTxt, inactiveTxt,
    } = options;
    if (this.theme !== themeName) {
      active.tintFill = false;
      active.setTint('#919191');
      activeTxt.setStyle({ color: '#969696' });
      this.theme = themeName;
      inactive.clearTint();
      inactiveTxt.setStyle({ color: '#ffffff' });
    } else {
      active.clearTint();
      activeTxt.setStyle({ color: '#ffffff' });
      this.theme = null;
    }
  }

  dialogEvents() {
    this.theme1.on('pointerover', () => {
      this.theme1.tintFill = false;
      this.theme1.setTint('#919191');
    });
    this.theme1.on('pointerout', () => {
      if (this.theme !== 'dark') {
        this.theme1.clearTint();
      }
    });
    this.theme1.on('pointerdown', () => {
      this.changeTheme({
        themeName: 'dark',
        active: this.theme1,
        inactive: this.theme2,
        activeTxt: this.theme1Text,
        inactiveTxt: this.theme2Text,
      });
    });
    this.theme2.on('pointerover', () => {
      this.theme2.tintFill = false;
      this.theme2.setTint('#919191');
    });
    this.theme2.on('pointerout', () => {
      if (this.theme !== 'light') {
        this.theme2.clearTint();
      }
    });
    this.theme2.on('pointerdown', () => {
      this.changeTheme({
        themeName: 'light',
        active: this.theme2,
        inactive: this.theme1,
        activeTxt: this.theme2Text,
        inactiveTxt: this.theme1Text,
      });
    });
    this.okBtn.on('pointerup', () => {
      if (this.theme !== null) {
        this.menu.scene.start('LoadScene', this.theme);
      }
    });
    this.close.on('pointerup', () => {
      this.removeDialog();
      this.init();
    });
  }

  removeDialog() {
    this.dialogBackground.destroy();
    this.box.destroy();
    this.close.destroy();
    this.dialogTitle.destroy();
    this.theme1.destroy();
    this.theme2.destroy();
    this.theme1Text.destroy();
    this.theme2Text.destroy();
    this.okBtn.destroy();
    this.okBtn.textContent.destroy();
  }

  removeMainMenu() {
    this.logo.destroy();
    this.playBtn.destroy();
    this.playBtn.textContent.destroy();
    this.soundBtn.on.destroy();
    this.soundBtn.off.destroy();
    this.aboutBtn.destroy();
    this.aboutBtn.textContent.destroy();
    this.optionsBtn.destroy();
    this.optionsBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
