export default class MainMenu {
  constructor(scene) {
    this.menu = scene;
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
      this.menu.scene.start('LoadScene');
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

  removeMainMenu() {
    this.logo.destroy();
    this.playBtn.destroy();
    this.playBtn.textContent.destroy();
    this.soundBtn.on.destroy();
    this.soundBtn.off.destroy();
    this.aboutBtn.destroy();
    this.optionsBtn.destroy();
    this.optionsBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
