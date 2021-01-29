export default class AboutPage {
  constructor(scene) {
    this.menu = scene;
    this.x = this.menu.game.renderer.width;
    this.y = this.menu.game.renderer.height;
    this.keys = [];
  }

  init() {
    this.createTitle();
    this.createFontSize();
    this.createBackground();
    this.createBackBtn();
    this.createText();
    this.createKeySet();
    this.createRunSection();
    this.createWeaponSection();
    this.initClicks();
  }

  initClicks() {
    this.backBtn.on('pointerdown', () => {
      this.removeAbout();
      this.menu.main.init();
    });
  }

  createTitle() {
    this.title = this.menu.add.image(this.x / 2,
      this.y * 0.1, 'title');

    const { about } = this.menu.currentLang.vacabluary;
    this.title.textContent = this.menu.make.text(
      {
        x: this.x / 2,
        y: this.y * 0.1 + 7,
        text: about,
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
    } else if (this.x < 1200 && this.x > this.y) {
      this.backgroundWidth = this.x - this.x / 5;
      x = this.x / 10;
    } else {
      this.backgroundWidth = this.x - this.x / 3;
      x = this.x / 6;
    }
    this.backgroundHeight = this.y - this.y * 0.4;

    this.background = this.menu.add.renderTexture(x,
      this.y * 0.2, this.backgroundWidth, this.backgroundHeight);
    this.background.fill(0x000000, 0.65);
  }

  createFontSize() {
    if (this.x > 1200 || this.y > this.x) {
      this.headerFont = '28px monospace';
      this.textFont = '22px monospace';
    } else {
      this.headerFont = '22px monospace';
      this.textFont = '18px monospace';
    }
  }

  createKey(x, y, text, description) {
    const key = this.menu.add.image(x, y, 'key-btn').setDepth(3);
    key.textContent = this.menu.make.text({
      x,
      y,
      text,
      style: {
        font: this.textFont,
        fill: '#212121',
      },
    });
    key.textContent.setDepth(6).setOrigin(0.5, 0.5);
    key.description = this.menu.make.text({
      text: `${text}:  ${description}`,
      style: {
        font: this.textFont,
        fill: '#ffffff',
      },
    });
    // key.description.setTint('0xbababa');
    key.setInteractive();

    key.on('pointerover', () => {
      const btn = key;
      btn.tintFill = false;
      btn.setTint('0xbababa');
      btn.setScale(1.1);
      btn.description.setScale(1.15);
      // btn.description.clearTint();
    });

    key.on('pointerout', () => {
      const btn = key;
      btn.clearTint();
      btn.setScale(1);
      btn.description.setScale(1);
      // btn.description.setTint('0xbababa');
    });
    this.keys.push(key);

    return key;
  }

  createKeySet() {
    const {
      up, down, left, right, RIFLE, KNIFE, PISTOL, SHORTGUN,
    } = this.menu.currentLang.vacabluary;
    this.downKey = this.createKey(0, 0, 'S', down);
    this.leftKey = this.createKey(0, 0, 'A', left);
    this.rightKey = this.createKey(0, 0, 'D', right);
    this.upKey = this.createKey(0, 0, 'W', up);
    this.knifeKey = this.createKey(0, 0, '1', KNIFE);
    this.pistolKey = this.createKey(0, 0, '2', PISTOL);
    this.shotgunKey = this.createKey(0, 0, '3', SHORTGUN);
    this.rifleKey = this.createKey(0, 0, '4', RIFLE);

    this.keyWidth = this.downKey.width;
  }

  createRunSection() {
    const x = this.background.x * 1.2;
    const y = this.background.y + this.backgroundHeight * 0.3;

    const { run } = this.menu.currentLang.vacabluary;
    this.runTitle = this.menu.make.text({
      x,
      y,
      text: run,
      style: {
        font: this.headerFont,
        fill: '#ffffff',
      },
    }).setDepth(4);

    for (let i = 0; i < this.keys.length / 2; i++) {
      const text = this.keys[i].description;
      text.x = x;
      text.y = y + this.runTitle.height * (i + 1) + 10;
      text.setDepth(4);
    }

    this.setRunKeysPosition();
  }

  createWeaponSection() {
    let x;
    let y;
    if (this.x > this.y) {
      x = this.background.x + this.backgroundWidth / 2;
      y = this.background.y + this.backgroundHeight * 0.3;
    } else {
      const higherKey = this.keys[0].y;
      x = this.background.x * 1.2;
      y = higherKey + 50;
    }
    const { weapon } = this.menu.currentLang.vacabluary;

    this.weaponTitle = this.menu.make.text({
      x,
      y,
      text: weapon,
      style: {
        font: this.headerFont,
        fill: '#ffffff',
      },
    }).setDepth(4);

    const n = this.keys.length;

    for (let i = n / 2; i < n; i++) {
      const text = this.keys[i].description;
      text.x = x;
      text.y = y + this.runTitle.height * (i + 1 - n / 2) + 10;
      text.setDepth(4);
    }

    this.setWeaponKeysPosition();
  }

  setRunKeysPosition() {
    const { description } = this.keys[this.keys.length / 2 - 1];
    const {
      width, x, y,
    } = description;
    const distance = this.x > this.y ? this.background.x + this.backgroundWidth * 0.25
      : x + width + 120;
    this.leftKey.x = distance;
    this.leftKey.y = y;

    for (let i = 0; i < this.keys.length / 2; i++) {
      const key = this.keys[i];
      const { text } = key.textContent;
      if (text === 'W') {
        key.x = distance + this.keyWidth;
        key.y = y - key.height;
      } else {
        key.x = distance + this.keyWidth * (i);
        key.y = y;
      }
      key.textContent.x = key.x;
      key.textContent.y = key.y;
    }
  }

  setWeaponKeysPosition() {
    const { description } = this.keys[this.keys.length - 1];
    const {
      width, x, y,
    } = description;
    const distance = this.x > this.y ? this.background.x + this.backgroundWidth * 0.7
      : x + width + 120;
    const n = this.keys.length;

    for (let i = n / 2; i < n; i++) {
      const key = this.keys[i];
      key.x = distance + this.keyWidth * (i - n / 2);
      key.y = y;
      key.textContent.x = key.x;
      key.textContent.y = key.y;
    }
  }

  createBackBtn() {
    const x = this.x / 2;
    const y = this.y * 0.2 + this.backgroundHeight - 60;
    const { back } = this.menu.currentLang.vacabluary;
    this.backBtn = this.menu.createBtn(x, y, back);
  }

  createText() {
    const { aboutText1, aboutText2 } = this.menu.currentLang.vacabluary;
    const { x } = this.background;
    const { y } = this.background;
    const style = {
      font: this.headerFont,
      fill: '#ffffff',
      align: 'center',
      fixedWidth: this.backgroundWidth,
      wordWrap: { width: this.backgroundWidth *= 0.95 },
      padding: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 0,
      },
    };

    this.headerText1 = this.menu.make.text({
      x, y, text: aboutText1, style,
    })
      .setDepth(2);
    this.headerText2 = this.menu.make.text({
      x, y: y + this.headerText1.height, text: aboutText2, style,
    })
      .setDepth(2);
  }

  destroyKeys() {
    this.keys.forEach((el) => {
      el.textContent.destroy();
      el.description.destroy();
      el.destroy();
    });
    this.keys = [];
  }

  removeAbout() {
    this.title.destroy();
    this.title.textContent.destroy();
    this.headerText1.destroy();
    this.headerText2.destroy();
    this.runTitle.destroy();
    this.weaponTitle.destroy();
    this.backBtn.destroy();
    this.backBtn.textContent.destroy();
    this.background.destroy();
    this.destroyKeys();
    this.menu.hoverImg.setVisible(false);
  }
}
