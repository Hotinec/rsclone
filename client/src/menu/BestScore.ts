import GridTable from 'phaser3-rex-plugins/plugins/gridtable';
import { MenuScene } from '../scenes';
import { IButton } from '../scenes/BaseScene';
import { IResult } from '../scenes/IResult';
import { getAllResults } from '../services/httpService';

export default class Score {
  menu: MenuScene;

  results: [IResult] | [];

  title: IButton;

  backBtn: IButton;

  table: Phaser.GameObjects.Image;

  constructor(scene: MenuScene) {
    this.menu = scene;
  }

  async init(): Promise<void> {
    this.results = await getAllResults();
    this.createTitle();
    this.createTable();
    this.createBackBtn();
  }

  createTitle(): void {
    const { width, height } = this.menu.game.renderer;
    // @ts-ignore
    const { bestScore } = this.menu.currentLang.vocabulary;

    this.title = this.menu.add.image(width / 2,
      height * 0.14, 'title') as IButton;
    this.title.textContent = this.menu.make.text(
      {
        x: width / 2,
        y: height * 0.14,
        text: bestScore,
        style: {
          font: '40px monospace, sans-serif',
          color: '#212121',
        },
      },
    );
    this.title.textContent.setOrigin(0.5, 0).setDepth(2);
  }

  createTable(): void {
    const { width, height } = this.menu.game.config;

    this.table = new GridTable(this.menu,
      Number(width) / 2,
      Number(height) / 2,
      500,
      Number(height) / 2,
      {
        cellWidth: 500,
        cellHeight: 50,
        cellsCount: this.results.length + 1,
        columns: 1,
        cellVisibleCallback: this.onCellVisible.bind(this),
        clamplTableOXY: false,
      });
    this.table.setOrigin(0.5, 0.5);
  }

  onCellVisible(cell: any): void {
    const newCellObject = this.createCellObj(cell);

    cell.setContainer(newCellObject);
  }

  createCellObj(cell: any): Phaser.GameObjects.Container {
    const bg = this.menu.add.graphics()
      .fillStyle(0xFFFFFF, 0.2)
      .fillRect(2, 2, 500 - 2, 50 - 2);
    const bg1 = this.menu.add.graphics()
      .fillStyle(0x212121, 0.7)
      .fillRect(4, 4, 500 - 6, 50 - 4);
    let container;
    if (cell.index === 0) {
      container = this.createTitleRow([bg, bg1]);
    } else {
      container = this.createResultRow(cell.index - 1, [bg, bg1]);
    }
    return container;
  }

  createResultRow(
    idx: number, arr: Array<Phaser.GameObjects.Graphics>,
  ): Phaser.GameObjects.Container {
    const width = 500;
    const part = width / 5;

    const {
      time, score, name, date,
    } = this.results[idx];

    const shortName = name.length < 12 ? name : name.slice(0, 12);

    const font = '16px monospace, sans-serif';

    const getDate = (): string => {
      const newDate = new Date(date);
      const day = newDate.getDate();
      const month = newDate.getMonth();
      const year = newDate.getFullYear();
      return `${day}/${month + 1}/${year}`;
    };

    const txtIdx = this.menu.add.text(20, 20, `${idx + 1}.`, { font });
    const txtName = this.menu.add.text(35, 20, `${shortName}`, { font });
    const txtTime = this.menu.add.text(1.7 * part, 20, `${time}`, { font });
    const txtDate = this.menu.add.text(2.9 * part, 20, `${getDate() || ''}`, { font });
    const txtScore = this.menu.add.text(4.3 * part, 20, `${score}`, { font });

    const container = this.menu.add.container(0, 0,
      [...arr, txtIdx, txtName, txtTime, txtScore, txtDate]);
    return container;
  }

  createTitleRow(arr: Array<Phaser.GameObjects.Graphics>): Phaser.GameObjects.Container {
    const width = 500;
    const part = width / 5;

    const font = '25px monospace, sans-serif';
    const color = '#ffffff';
    const {
      nameTitle, timeTitle, dateTitle, scoreTitle,
      // @ts-ignore
    } = this.menu.currentLang.vocabulary;

    const txtName = this.menu.add.text(part / 2, 10, nameTitle, { font, color });
    const txtTime = this.menu.add.text(part * 1.75, 10, timeTitle, { font, color });
    const txtDate = this.menu.add.text(part * 3, 10, dateTitle, { font, color });
    const txtScore = this.menu.add.text(part * 4, 10, scoreTitle, { font, color });

    const container = this.menu.add.container(0, 0,
      [...arr, txtName, txtTime, txtScore, txtDate]);
    return container;
  }

  createBackBtn(): void {
    const { width, height } = this.menu.game.renderer;
    // @ts-ignore
    const { back } = this.menu.currentLang.vocabulary;

    this.backBtn = this.menu.createBtn(width / 2, height * 0.82, back);

    this.backBtn.on('pointerdown', () => {
      this.removeBestScore();
      this.menu.main.init();
    });
  }

  removeBestScore(): void {
    this.title.destroy();
    this.title.textContent.destroy();
    this.table.destroy();
    this.backBtn.destroy();
    this.backBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
