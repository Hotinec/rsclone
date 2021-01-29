export default class OptionsMenu {
  constructor(scene) {
    this.menu = scene;
    this.x = this.menu.game.renderer.width;
    this.y = this.menu.game.renderer.height;
    this.btnsTexts = [];
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
  }

  init() {
    this.menu.hoverImg.setScale(0.3);
    this.createTitle();
    this.createBackground();
    this.createVolumeSet();
    this.createFSOpt();
    this.createLangOpt();
    this.createBackBtn();
    this.initClicks();
  }

  createTitle() {
    this.title = this.menu.add.image(this.x / 2,
      this.y * 0.1, 'title');
    const { options } = this.menu.currentLang.vacabluary;
    this.title.textContent = this.menu.make.text(
      {
        x: this.x / 2,
        y: this.y * 0.1 + 7,
        text: options,
        style: {
          font: '40px monospace',
          fill: '#212121',
        },
      },
    );
    this.title.textContent.setOrigin(0.5, 0.1).setDepth(2);
  }

  createBackground() {
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

  createFSOpt() {
    const y = this.y * 0.45;
    const titleX = this.x / 2 - 145;

    const { isFullscreen } = this.menu.scale;
    const { fullScreen } = this.menu.currentLang.vacabluary;

    this.fullScreen = this.menu.add.text(titleX, y, fullScreen, { font: '26px monospace' });

    const btnX = titleX + 270;
    // const btnX = titleX + this.fullScreen.displayWidth + 100;
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

  createLangOpt() {
    const y = this.y * 0.55;
    const titleX = this.x / 2 - 145;

    const { language } = this.menu.currentLang.vacabluary;
    const { lang } = this.menu.currentLang;

    const isEnglish = lang === 'en';
    this.language = this.menu.add.text(titleX, y, language, { font: '26px monospace' });

    const btnX = titleX + 270;
    // const btnX = titleX + this.language.displayWidth + 125;
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

  createVolumeSet() {
    const titleX = this.x / 2 - 145;
    const y = this.y * 0.35;

    const { volume } = this.menu.currentLang.vacabluary;

    this.volumeTitle = this.menu.add.text(
      titleX,
      y, volume, { font: '26px monospace' },
    );
    const boxX = this.x / 2 - 145 + 130;
    // const boxX = this.x / 2 - 140 + this.volumeTitle.displayWidth;
    this.volumeBox = this.menu.add.image(
      boxX,
      y,
    );
    this.volumeBox.displayWidth = 50;
    this.volumeBox.displayHeight = 20;
    this.volumeBox.setOrigin(0.5, 0.5);
    this.createVolumeIndicator(y);
  }

  createVolumeIndicator(y) {
    for (let i = 0; i < 5; i++) {
      this.createVolumeRange(y, i, 'empty-scull', this.volumeIndicatorsOff);
      this.createVolumeRange(y, i, 'scull', this.volumeIndicatorsOn);
    }
  }

  createVolumeRange(y, i, btn, arr) {
    const width = this.volumeBox.x;
    // const width = this.volumeBox.x + this.volumeBox.width * 1.2;
    // const width = this.volumeBox.x + this.volumeBox.width / 2;
    const img = this.menu.add.image(100, 100, btn).setDepth(3);
    const x = width + img.width * 0.2 * i + img.width * 0.2;
    img.setScale(0.25);
    img.x = x;
    img.y = y + 13;
    img.id = i;
    img.setInteractive();
    arr.push(img);
  }

  createBackBtn() {
    const x = this.x / 2;
    const y = this.y * 0.2 + this.backgroundHeight - 60;

    const { back } = this.menu.currentLang.vacabluary;
    this.backBtn = this.menu.createBtn(x, y, back);
  }

  initClicks() {
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
      el.on('pointerdown', () => {
        this.setVolumeUp(idx);
      });
    });

    this.volumeIndicatorsOn.forEach((el, idx) => {
      el.on('pointerdown', () => {
        this.setVolumeDown(idx);
      });
    });
  }

  setVolumeUp(idx) {
    const n = +`0.${idx}`;
    this.menu.game.volume = n;
    this.menu.sound.setVolume(n);

    for (let i = 0; i <= idx; i++) {
      this.volumeIndicatorsOn[i].setVisible(true);
    }
  }

  setVolumeDown(idx) {
    const n = +`0.${idx}`;
    this.menu.sound.setVolume(n);

    for (let i = this.volumeIndicatorsOn.length - 1; idx <= i; i--) {
      this.volumeIndicatorsOn[i].setVisible(false);
    }
  }

  setLanguage() {
    const { languages } = this.menu;
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

  removeOptionsMenu() {
    this.title.destroy();
    this.title.textContent.destroy();
    this.background.destroy();
    this.backBtn.destroy();
    this.backBtn.textContent.destroy();
    this.volumeBox.destroy();
    this.fullScreen.destroy();
    this.language.destroy();
    this.englBtn.on.destroy();
    this.englBtn.off.destroy();
    this.fullScreenBtn.on.destroy();
    this.fullScreenBtn.off.destroy();
    this.volumeTitle.destroy();
    this.menu.hoverImg.setVisible(false);
    this.volumeIndicatorsOn.forEach((el) => el.destroy());
    this.volumeIndicatorsOff.forEach((el) => el.destroy());
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
  }
}
