/* eslint-disable no-debugger */
import { LINKS_URL } from '../constants';
import { MenuScene } from '../scenes';
import openLink from '../utils/openLink';

export default class AboutPage {
    menu: MenuScene;

    x: number;

    y: number;

    keys: Phaser.GameObjects.Image[];

    runBtns: Phaser.GameObjects.Image[];

    weaponBtns: Phaser.GameObjects.Image[];

    githubLinks: Phaser.GameObjects.Text[];

    weaponTitle: Phaser.GameObjects.Text;

    runTitle: Phaser.GameObjects.Text;

    linkContainer: Phaser.GameObjects.Container;

    runSection: Phaser.GameObjects.Container;

    weaponSection: Phaser.GameObjects.Container;

    container: Phaser.GameObjects.Container;

    title: Phaser.GameObjects.Image;

    backgroundWidth: number;

    backgroundHeight: number;

    keyWidth: number;

    background: Phaser.GameObjects.RenderTexture;

    headerText1: Phaser.GameObjects.Text;

    headerText2: Phaser.GameObjects.Text;

    createdBy: Phaser.GameObjects.Text;

    textFont: string;

    headerFont: string;

    backBtn: Phaser.GameObjects.Image;

    nextBtn: Phaser.GameObjects.Image;

    prevBtn: Phaser.GameObjects.Image;

    downKey : Phaser.GameObjects.Image;

    leftKey : Phaser.GameObjects.Image;

    rightKey : Phaser.GameObjects.Image;

    upKey : Phaser.GameObjects.Image;

    knifeKey : Phaser.GameObjects.Image;

    pistolKey : Phaser.GameObjects.Image;

    shotgunKey : Phaser.GameObjects.Image;

    rifleKey : Phaser.GameObjects.Image;

    constructor(scene: MenuScene) {
      this.menu = scene;
      this.x = this.menu.game.renderer.width;
      this.y = this.menu.game.renderer.height;
      this.keys = [];
    }

    init(): void {
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

    initClicks(): void {
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

    createTitle(): void {
      this.title = this.menu.add.image(this.x / 2,
        this.y * 0.1, 'title');
      // @ts-ignore
      const { about } = this.menu.currentLang.vacabluary;
      // @ts-ignore
      this.title.textContent = this.menu.make.text(
        {
          x: this.x / 2,
          y: this.y * 0.1 + 7,
          text: about,
          style: {
            font: '40px monospace, sans-serif',
            color: '#212121',
          },
        },
      );
      // @ts-ignore
      this.title.textContent.setOrigin(0.5, 0.1).setDepth(2);
    }

    createLinkContainer(): void {
      const { height, y } = this.headerText2;
      const headerY = y + height + 30;
      const x = this.backgroundWidth * 0.5 + this.background.x;

      // @ts-ignore
      const { createdBy } = this.menu.currentLang.vacabluary;

      this.createdBy = this.menu.make.text({
        x,
        y: headerY,
        text: createdBy,
        style: {
          font: this.headerFont,
        },
      }).setDepth(4);
      this.createdBy.x = x - this.createdBy.width / 2;
      const style = {
        font: this.textFont,
        padding: {
          left: this.backgroundWidth * 0.1,
        },
      };

      const linksY: number = this.createdBy.y + this.createdBy.height + 20;

      const link1 :Phaser.GameObjects.Text = this.menu.make.text({
        x: this.background.x, y: linksY, text: LINKS_URL.ARTEM, style,
      });
      const link2 :Phaser.GameObjects.Text = this.menu.make.text({
        x: this.background.x, y: linksY, text: LINKS_URL.POLINA, style,
      });
      const link3 :Phaser.GameObjects.Text = this.menu.make.text({
        x: this.background.x, y: linksY, text: LINKS_URL.ARSENIY, style,
      });
      const link4 :Phaser.GameObjects.Text = this.menu.make.text({
        x: this.background.x, y: linksY, text: LINKS_URL.NASTYA, style,
      });
      this.githubLinks = [link1, link2, link3, link4];

      this.githubLinks.forEach((el, idx) => {
        const link = el;
        link.y += (link.height + 10) * idx;
        link.setInteractive();
        AboutPage.initLinksEvents(link);
      });

      const logoLink = this.menu.add.image(0, 0, 'rss-logo');
      logoLink.displayWidth = 150;
      logoLink.displayHeight = 60;
      logoLink.x = this.background.x + this.backgroundWidth - logoLink.displayWidth;
      logoLink.y = link2.y;
      logoLink.setInteractive();
      logoLink.on('pointerdown', openLink, LINKS_URL.RSS);
      const children = [logoLink, this.createdBy, ...this.githubLinks];

      this.linkContainer = this.menu.add.container(0, 0, children).setVisible(false);
    }

    static initLinksEvents(el: Phaser.GameObjects.Text): void {
      el.on('pointerover', () => {
        const link = el;
        link.tintFill = false;
        link.setTint(0xbababa);
      });

      el.on('pointerdown', openLink, el.text);

      el.on('pointerout', () => {
        const link = el;
        link.clearTint();
      });
    }

    turnNext(): void {
      const children = [...this.container.list];
      const current = this.container.getByName('current slide');
      const idx = children.indexOf(current);
      if (children[idx + 1]) {
        // @ts-ignore
        const slide: Phaser.GameObjects.Container = children[idx + 1];
        slide.name = 'current slide';
        slide.setVisible(true);
      } else {
        children[0].name = 'current slide';
        // @ts-ignore
        children[0].setVisible(true);
      }
      current.name = '';
      // @ts-ignore
      current.setVisible(false);
    }

    turnPrev(): void {
      const children = this.container.list;
      const current = this.container.getByName('current slide');
      const idx = children.indexOf(current);
      if (children[idx - 1]) {
        children[idx - 1].name = 'current slide';
        // @ts-ignore
        children[idx - 1].setVisible(true);
      } else {
        children[children.length - 1].name = 'current slide';
        // @ts-ignore
        children[children.length - 1].setVisible(true);
      }
      current.name = '';
      // @ts-ignore
      current.setVisible(false);
    }

    createContentContainer(): void {
      this.container = this.menu.add.container(0, 0);
      this.container.add(this.runSection);
      this.container.add(this.weaponSection);
      this.container.add(this.linkContainer);
      const containerWidth = this.rifleKey.x - this.weaponTitle.x;
      this.container.width = containerWidth;

      const { first } = this.container;
      // @ts-ignore
      first.setVisible(true);
      first.name = 'current slide';
      this.createSliderBtns();
    }

    createSliderBtns(): void {
      const prevX = this.x / 2 - this.backBtn.width / 2;
      const nextX = this.x / 2 + this.backBtn.width / 2;
      const y = this.backBtn.y - this.backgroundHeight * 0.15;

      this.nextBtn = this.menu.createBtn(nextX, y, '', 'next-btn');
      this.prevBtn = this.menu.createBtn(prevX, y, '', 'prev-btn');
      this.nextBtn.displayWidth = 54;
      this.prevBtn.displayWidth = 54;

      this.switchOffHover();
    }

    createBackground(): void {
      let x;
      if (this.x < 820) {
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

    createFontSize(): void {
      if (this.x > 1200 || this.y > this.x) {
        this.headerFont = '24px monospace, sans-serif';
        this.textFont = '20px monospace, sans-serif';
      } else {
        this.headerFont = '22px monospace, sans-serif';
        this.textFont = '18px monospace, sans-serif';
      }
    }

    createKey(x: number, y: number, text: string, description: string): Phaser.GameObjects.Image {
      const key: Phaser.GameObjects.Image = this.menu.add.image(x, y, 'key-btn').setDepth(3);
      // @ts-ignore
      key.textContent = this.menu.make.text({
        x,
        y,
        text,
        style: {
          font: this.textFont,
          color: '#212121',
        },
      });
      // @ts-ignore
      key.textContent.setDepth(6).setOrigin(0.5, 0.5);
      // @ts-ignore
      key.description = this.menu.make.text({
        text: `${text}:  ${description}`,
        style: {
          font: this.textFont,
        },
      });
      key.setInteractive();

      key.on('pointerover', () => {
        const btn = key;
        btn.tintFill = false;
        btn.setTint(0Xbababa);
        btn.setScale(1.1);
        // @ts-ignore
        btn.description.setScale(1.15);
      });

      key.on('pointerout', () => {
        const btn = key;
        btn.clearTint();
        btn.setScale(1);
        // @ts-ignore
        btn.description.setScale(1);
      });

      this.keys.push(key);

      return key;
    }

    createKeySet(): void {
      const {
        up, down, left, right, RIFLE, KNIFE, PISTOL, SHORTGUN,
        // @ts-ignore
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

    createRunContainer(): void {
      const { height, y } = this.headerText2;
      const runY = y + height + 50;
      const runX = this.backgroundWidth / 2 + this.background.x;
      // @ts-ignore
      const { run } = this.menu.currentLang.vacabluary;
      this.runTitle = this.menu.make.text({
        x: 0,
        y: 0,
        text: run,
        style: {
          font: this.headerFont,
        },
      }).setDepth(4);

      for (let i = 0; i < this.keys.length / 2; i++) {
        // @ts-ignore
        const text = this.keys[i].description;
        text.x = this.runTitle.x;
        text.y = this.runTitle.y + this.runTitle.height * (i + 1) + 10;
        text.setDepth(4);
      }

      this.runBtns = this.keys.slice(0, this.keys.length / 2);
      const texts: [] = [];
      this.runBtns.forEach((el) => {
        // @ts-ignore
        texts.push(el.description);
        // @ts-ignore
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

    setRunKeysPosition(): void {
      // @ts-ignore
      const { description } = this.runBtns[this.runBtns.length - 1];
      const {
        width, x, y,
      } = description;

      const distance = width + x + 120;
      this.leftKey.x = distance;
      this.leftKey.y = y;

      for (let i = 0; i < this.runBtns.length; i++) {
        const key = this.runBtns[i];
        // @ts-ignore
        const { text } = key.textContent;
        if (text === 'W') {
          key.x = distance + this.keyWidth;
          key.y = y - key.height;
        } else {
          key.x = distance + this.keyWidth * (i);
          key.y = y;
        }
        // @ts-ignore
        key.textContent.x = key.x;
        // @ts-ignore
        key.textContent.y = key.y;
      }
    }

    createWeaponContainer(): void {
      const { height, y } = this.headerText2;
      const weaponY = y + height + 50;
      const weaponX = this.backgroundWidth / 2 + this.background.x;
      // @ts-ignore
      const { weapon } = this.menu.currentLang.vacabluary;
      this.weaponTitle = this.menu.make.text({
        x: 0,
        y: 0,
        text: weapon,
        style: {
          font: this.headerFont,
        },
      }).setDepth(4);

      this.weaponBtns = this.keys.slice(this.keys.length / 2, this.keys.length);
      for (let i = 0; i < this.weaponBtns.length; i++) {
        // @ts-ignore
        const text = this.weaponBtns[i].description;
        text.x = this.weaponTitle.x;
        text.y = this.weaponTitle.y + this.weaponTitle.height * (i + 1) + 10;
        text.setDepth(4);
      }

      const texts: [] = [];
      this.weaponBtns.forEach((el) => {
        // @ts-ignore
        texts.push(el.description);
        // @ts-ignore
        texts.push(el.textContent);
      });

      this.setWeaponKeysPosition();

      const children = [this.weaponTitle, ...this.weaponBtns, ...texts];
      this.weaponSection = this.menu.add.container(0, weaponY, children).setVisible(false);
      const containerWidth = this.rifleKey.x - this.weaponTitle.x;
      this.weaponSection.width = containerWidth;
      this.weaponSection.x = weaponX - containerWidth / 2;
    }

    setWeaponKeysPosition(): void {
      // @ts-ignore
      const { description } = this.keys[this.keys.length - 1];
      const {
        width, x, y,
      } = description;
      // const distance = this.x > this.y ? this.background.x + this.backgroundWidth * 0.7
      //   : x + width + 120;
      const distance = width + x + 120;
      const n = this.keys.length;

      for (let i = n / 2; i < n; i++) {
        const key: Phaser.GameObjects.Image = this.keys[i];
        key.x = distance + this.keyWidth * (i - n / 2);
        key.y = y;
        // @ts-ignore
        key.textContent.x = key.x;
        // @ts-ignore
        key.textContent.y = key.y;
      }
    }

    createBackBtn(): void {
      const x = this.x / 2;
      const y = this.y * 0.2 + this.backgroundHeight - 60;
      // @ts-ignore
      const { back } = this.menu.currentLang.vacabluary;
      this.backBtn = this.menu.createBtn(x, y, back);
    }

    createText(): void {
      // @ts-ignore
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

    destroyKeys(): void {
      this.keys.forEach((el : Phaser.GameObjects.Image) => {
        // @ts-ignore
        el.textContent.destroy();
        // @ts-ignore
        el.description.destroy();
        el.destroy();
      });
      this.keys = [];
    }

    removeAbout(): void {
      this.keys = [];
      this.runBtns = [];
      this.weaponBtns = [];
      this.title.destroy();
      // @ts-ignore
      this.title.textContent.destroy();
      this.headerText1.destroy();
      this.headerText2.destroy();
      this.container.destroy();
      this.nextBtn.destroy();
      this.prevBtn.destroy();
      this.backBtn.destroy();
      // @ts-ignore
      this.backBtn.textContent.destroy();
      this.background.destroy();
      this.menu.hoverImg.setVisible(false);
    }

    switchOffHover(): void {
      this.nextBtn.on('pointerover', () => {
        this.menu.hoverImg.setVisible(false);
      });

      this.prevBtn.on('pointerover', () => {
        this.menu.hoverImg.setVisible(false);
      });
    }
}
