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
    this.bestSoresBtn = this.menu.createBtn(width / 2, height / 2 + 150, 'Best Scores');
    this.soundBtn = this.menu.createBtn(width / 2, height / 2 + 200, audio.isPlaying ? 'Sound On' : 'Sound Off');
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

    this.bestSoresBtn.on('pointerdown', () => {
      this.removeMainMenu();
      this.menu.score.init();
    });

    this.soundBtn.on('pointerdown', () => {
      if (this.soundBtn.textContent.text === 'Sound Off') {
        if (!this.menu.audio.isPlaying) {
          this.menu.audio.play();
          this.menu.soundOn = true;
          this.soundBtn.textContent.setText('Sound On');
          return;
        }
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
    this.soundBtn.destroy();
    this.soundBtn.textContent.destroy();
    this.bestSoresBtn.destroy();
    this.bestSoresBtn.textContent.destroy();
    this.optionsBtn.destroy();
    this.optionsBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
