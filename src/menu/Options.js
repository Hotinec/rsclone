export default class OptionsMenu {
  constructor(scene) {
    this.menu = scene;
    this.x = this.menu.game.renderer.width / 2;
    this.y = this.menu.game.renderer.height;
    this.btnsTexts = [];
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
    this.btwDistanse = 70;
    this.operationNum = 0;
  }

  init() {
    this.menu.hoverImg.setScale(0.3);
    this.checkSize();
    this.createTitle();
    this.createVolumeSet();
    this.createFSOpt();
    this.createBackBtn();
    this.initClicks();
  }

  checkSize() {
    const middleWidth = 1000;
    const middleHeight = 700;
    const { width, height } = this.menu.game.config;

    if (width < middleWidth && middleHeight < height) {
      this.btwDistanse = 50;
    }
  }

  createTitle() {
    this.title = this.menu.add.image(this.x,
      this.y * 0.1, 'title');
    this.title.textContent = this.menu.make.text(
      {
        x: this.x,
        y: this.y * 0.1,
        text: 'Options',
        style: {
          font: '40px monospace',
          fill: '#212121',
        },
      },
    );
    this.title.textContent.setOrigin(0.5, 0.1).setDepth(2);
  }

  createFSOpt() {
    const y = this.y * 0.3;

    const { isFullscreen } = this.menu.scale;

    this.fullScreenBtn = this.menu.createBtn(this.x, y + this.operationNum * this.btwDistanse, isFullscreen ? 'FullScreen On' : 'FullScreen Off');
    this.operationNum++;
  }

  createVolumeSet() {
    const y = this.y * 0.3 + this.operationNum * this.btwDistanse;

    // this.volumeTitle = this.menu.add.image(this.x , y+this.operationNum*this.btwDistanse, 'btn')

    this.volumeTitle = this.menu.add.image(this.x, y, 'btn');
    this.volumeTitle.textContent = this.menu.make.text({
      x: this.x,
      y,
      text: 'Volume',
      style: {
        font: '30px monospace',
        fill: '#212121',
      },
    });
    this.volumeTitle.textContent.setOrigin(0.5, 0.5);
    this.operationNum++;

    // this.volumeBox = this.menu.add.image(this.x , y+this.operationNum*this.btwDistanse, 'btn')
    this.volumeBox = this.menu.add.image(this.x, y, 'btn');
    this.volumeBox.setVisible(false);
    this.createVolumeIndicator();
    this.operationNum++;
  }

  createVolumeIndicator() {
    for (let i = 0; i < 5; i++) {
      this.createVolumeRange(i, 'empty-scull', this.volumeIndicatorsOff);
      this.createVolumeRange(i, 'scull', this.volumeIndicatorsOn);
    }
  }

  createVolumeRange(i, btn, arr) {
    const width = this.volumeBox.x - this.volumeBox.width / 2.5;
    const y = this.y * 0.3 + this.operationNum * this.btwDistanse;
    const img = this.menu.add.image(100, 100, btn).setDepth(3);
    img.setScale(0.25);
    img.x = width + img.width * 0.2 * i + img.width * 0.2;
    img.y = y;
    img.id = i;
    img.setInteractive();
    arr.push(img);
  }

  createBackBtn() {
    const y = this.y * 0.3;

    this.backBtn = this.menu.createBtn(this.x, y + this.operationNum * this.btwDistanse, 'Back');
  }

  initClicks() {
    this.fullScreenBtn.on('pointerdown', () => {
      const btn = this.fullScreenBtn.textContent;
      const { isFullscreen } = this.menu.scale;
      if (!isFullscreen) {
        this.menu.scale.startFullscreen();
        btn.setText('FullScreen On');
        // this.menu.game.scale.resize();
      } else {
        this.menu.scale.stopFullscreen();
        btn.setText('FullScreen Off');
      }
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

  removeOptionsMenu() {
    this.title.destroy();
    this.title.textContent.destroy();
    this.backBtn.destroy();
    this.backBtn.textContent.destroy();
    this.volumeBox.destroy();
    this.fullScreenBtn.destroy();
    this.fullScreenBtn.textContent.destroy();
    this.volumeTitle.destroy();
    this.volumeTitle.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
    this.volumeIndicatorsOn.forEach((el) => el.destroy());
    this.volumeIndicatorsOff.forEach((el) => el.destroy());
    this.volumeIndicatorsOn = [];
    this.volumeIndicatorsOff = [];
    this.operationNum = 0;
  }
}
