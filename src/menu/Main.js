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
    this.optionsBtn = this.menu.createBtn(width / 2, height / 2 + 100, 'Options');
    this.soundBtn = this.menu.createBtn(width / 2, height / 2 + 150, audio.isPlaying ? 'Sound On' : 'Sound Off');
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

    this.soundBtn.on('pointerdown', () => {
      if (this.soundBtn.textContent.text === 'Sound Off') {
        if (!this.menu.audio.isPlaying) {
          this.menu.audio.play();
          this.soundBtn.textContent.setText('Sound On');
          return;
        }

        this.menu.sound.setMute(false);
        this.soundBtn.textContent.setText('Sound On');
        return;
      }

      if (this.soundBtn.textContent.text === 'Sound On') {
        this.menu.sound.setMute(true);
        this.soundBtn.textContent.setText('Sound Off');
      }
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
    this.soundBtn.destroy();
    this.soundBtn.textContent.destroy();
    this.optionsBtn.destroy();
    this.optionsBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
