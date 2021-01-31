/* eslint-disable no-debugger */
import { GITHUB_LINKS } from '../constants';

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
    this.createRunContainer();
    this.createWeaponContainer();
    this.createLinkContainer();
    this.createContentContainer();
    this.initClicks();
  }

  initClicks() {
    this.backBtn.on('pointerdown', () => {
      this.removeAbout();
      this.menu.main.init();
    });

    this.nextBtn.on('pointerdown', () => {
      this.turnNext();
    });

    this.prevBtn.on('pointerdown', () => {
      this.turnPrev();
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

  createLinkContainer() {
    const { height, y } = this.headerText2;
    const headerY = y + height + 30;
    const x = this.backgroundWidth * 0.5 + this.background.x;

    this.createdBy = this.menu.make.text({
      x,
      y: headerY,
      text: 'Created by',
      style: {
        font: this.headerFont,
        fill: '#ffffff',
      },
    }).setDepth(4);
    this.createdBy.x = x - this.createdBy.width / 2;
    const style = {
      font: this.textFont,
      fill: '#ffffff',
      padding: {
        left: this.backgroundWidth * 0.2,
      },
    };

    const linksY = this.createdBy.y + this.createdBy.height + 20;

    const link1 = this.menu.make.text({
      x: this.background.x, y: linksY, text: GITHUB_LINKS.ARTEM, style,
    });
    link1.on('pointerdown', AboutPage.openLink, 'https://github.com/Hotinec');
    const link2 = this.menu.make.text({
      x: this.background.x, y: linksY, text: GITHUB_LINKS.POLINA, style,
    });
    const link3 = this.menu.make.text({
      x: this.background.x, y: linksY, text: GITHUB_LINKS.ARSENIY, style,
    });
    const link4 = this.menu.make.text({
      x: this.background.x, y: linksY, text: GITHUB_LINKS.NASTYA, style,
    });
    this.githubLinks = [link1, link2, link3, link4];

    this.githubLinks.forEach((el, idx) => {
      const link = el;
      link.y += (link.height + 10) * idx;
    });
    this.initHoverLinksEvents();

    const logoLink = this.menu.add.image(0, 0, 'rss-logo');
    logoLink.displayWidth = 150;
    logoLink.displayHight = 50;
    logoLink.y = link2.y;
    logoLink.x = link4.x + link4.width;
    logoLink.setInteractive();
    logoLink.on('pointerdown', AboutPage.openLink, GITHUB_LINKS.RSS);
    const children = [logoLink, this.createdBy, ...this.githubLinks];

    this.linkContainer = this.menu.add.container(0, 0, children).setVisible(false);
  }

  initHoverLinksEvents() {
    this.githubLinks.forEach((el) => {
      this.menu.initHover(el, false, true);
    });
  }

  static openLink(link) {
    const url = link;
    const action = window.open(url, '_blank');

    if (action && action.focus) {
      action.focus();
    } else if (!action) {
      window.location.href = url;
    }
  }

  turnNext() {
    const children = this.container.list;
    const current = this.container.getByName('current slide');
    const idx = children.indexOf(current);
    if (children[idx + 1]) {
      children[idx + 1].name = 'current slide';
      children[idx + 1].setVisible(true);
    } else {
      children[0].name = 'current slide';
      children[0].setVisible(true);
    }
    current.name = '';
    current.setVisible(false);
  }

  turnPrev() {
    const children = this.container.list;
    const current = this.container.getByName('current slide');
    const idx = children.indexOf(current);
    if (children[idx - 1]) {
      children[idx - 1].name = 'current slide';
      children[idx - 1].setVisible(true);
    } else {
      children[children.length - 1].name = 'current slide';
      children[children.length - 1].setVisible(true);
    }
    current.name = '';
    current.setVisible(false);
  }

  createContentContainer() {
    // const { height, y } = this.headerText2;
    // const Y = y + height + 50;
    // const X = this.backgroundWidth / 2 + this.background.x;
    this.container = this.menu.add.container(0, 0);
    // this.container = this.menu.add.container(X, Y);
    this.container.add(this.runSection);
    this.container.add(this.weaponSection);
    this.container.add(this.linkContainer);
    const containerWidth = this.rifleKey.x - this.weaponTitle.x;
    this.container.width = containerWidth;
    // this.container.x = X - containerWidth / 2;

    const { first } = this.container;
    first.setVisible(true);
    first.name = 'current slide';
    this.createSliderBtns();
  }

  createSliderBtns() {
    const prevX = this.x / 2 - this.backBtn.width / 2;
    const nextX = this.x / 2 + this.backBtn.width / 2;
    const y = this.backBtn.y - this.backgroundHeight * 0.15;

    this.nextBtn = this.menu.createBtn(nextX, y, '', 'next-btn');
    this.prevBtn = this.menu.createBtn(prevX, y, '', 'prev-btn');
    this.nextBtn.displayWidth = 54;
    this.prevBtn.displayWidth = 54;

    this.switchOffHover();
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
    // this.backgroundHeight = this.y - this.y * 0.4;
    this.backgroundHeight = this.y - this.y * 0.3;

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
      btn.setTint(0Xbababa);
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

  createRunContainer() {
    const { height, y } = this.headerText2;
    const runY = y + height + 50;
    const runX = this.backgroundWidth / 2 + this.background.x;

    const { run } = this.menu.currentLang.vacabluary;
    this.runTitle = this.menu.make.text({
      x: 0,
      y: 0,
      text: run,
      style: {
        font: this.headerFont,
        fill: '#ffffff',
      },
    }).setDepth(4);

    for (let i = 0; i < this.keys.length / 2; i++) {
      const text = this.keys[i].description;
      text.x = this.runTitle.x;
      text.y = this.runTitle.y + this.runTitle.height * (i + 1) + 10;
      text.setDepth(4);
    }

    this.runBtns = this.keys.slice(0, this.keys.length / 2);
    const texts = [];
    this.runBtns.forEach((el) => {
      texts.push(el.description);
      texts.push(el.textContent);
    });

    this.setRunKeysPosition();

    const children = [this.runTitle, ...this.runBtns, ...texts];
    this.runSection = this.menu.add.container(0, runY, children);
    const containerWidth = this.rightKey.x - this.runTitle.x;
    this.runSection.width = containerWidth;
    this.runSection.x = runX - containerWidth / 2;
    this.runSection.setVisible(false);
  }

  setRunKeysPosition() {
    const { description } = this.runBtns[this.runBtns.length - 1];
    const {
      width, x, y,
    } = description;
    // const distance = this.x > this.y ? this.background.x + this.backgroundWidth * 0.25
    //   : x + width + 120;
    const distance = width + x + 120;
    this.leftKey.x = distance;
    this.leftKey.y = y;

    for (let i = 0; i < this.runBtns.length; i++) {
      const key = this.runBtns[i];
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

  createWeaponContainer() {
    const { height, y } = this.headerText2;
    const weaponY = y + height + 50;
    const weaponX = this.backgroundWidth / 2 + this.background.x;

    const { weapon } = this.menu.currentLang.vacabluary;
    this.weaponTitle = this.menu.make.text({
      x: 0,
      y: 0,
      text: weapon,
      style: {
        font: this.headerFont,
        fill: '#ffffff',
      },
    }).setDepth(4);

    this.weaponBtns = this.keys.slice(this.keys.length / 2, this.keys.length);
    for (let i = 0; i < this.weaponBtns.length; i++) {
      const text = this.weaponBtns[i].description;
      text.x = this.weaponTitle.x;
      text.y = this.weaponTitle.y + this.weaponTitle.height * (i + 1) + 10;
      text.setDepth(4);
    }

    const texts = [];
    this.weaponBtns.forEach((el) => {
      texts.push(el.description);
      texts.push(el.textContent);
    });

    this.setWeaponKeysPosition();

    const children = [this.weaponTitle, ...this.weaponBtns, ...texts];
    this.weaponSection = this.menu.add.container(0, weaponY, children).setVisible(false);
    const containerWidth = this.rifleKey.x - this.weaponTitle.x;
    this.weaponSection.width = containerWidth;
    this.weaponSection.x = weaponX - containerWidth / 2;
  }

  setWeaponKeysPosition() {
    const { description } = this.keys[this.keys.length - 1];
    const {
      width, x, y,
    } = description;
    // const distance = this.x > this.y ? this.background.x + this.backgroundWidth * 0.7
    //   : x + width + 120;
    const distance = width + x + 120;
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
    this.keys = [];
    this.runBtns = [];
    this.weaponBtns = [];
    this.title.destroy();
    this.title.textContent.destroy();
    this.headerText1.destroy();
    this.headerText2.destroy();
    this.container.destroy();
    this.nextBtn.destroy();
    this.prevBtn.destroy();
    this.backBtn.destroy();
    this.backBtn.textContent.destroy();
    this.background.destroy();
    this.menu.hoverImg.setVisible(false);
  }

  switchOffHover() {
    this.nextBtn.on('pointerover', () => {
      this.menu.hoverImg.setVisible(false);
    });

    this.prevBtn.on('pointerover', () => {
      this.menu.hoverImg.setVisible(false);
    });
  }
}
