/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/extensions */
import GridTable from 'phaser3-rex-plugins/plugins/gridtable';
// import { GridTable } from 'phaser3-rex-plugins/templates/ui/ui-components';
// import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';
import { GameOverScene, MenuScene } from '../scenes';
import { IResult } from '../scenes/IResult';

export default class Score {
  menu: MenuScene;

  results: [IResult] | [];

  title: Phaser.GameObjects.Image;

  backBtn: Phaser.GameObjects.Image;

  constructor(scene: MenuScene) {
    this.menu = scene;
    this.results = GameOverScene.getResults();
  }

  init(): void {
    this.sortResults();
    this.createTitle();
    this.createTable();
    this.createBackBtn();
  }

  sortResults(): void {
    this.results.sort((a: IResult, b: IResult) => b.score - a.score);
  }

  createTitle(): void {
    const { width, height } = this.menu.game.renderer;

    this.title = this.menu.add.image(width / 2,
      height * 0.14, 'title');
    // @ts-ignore
    this.title.textContent = this.menu.make.text(
      {
        x: width / 2,
        y: height * 0.14,
        text: 'Best Score',
        style: {
          font: '40px monospace',
          // @ts-ignore
          fill: '#212121',
        },
      },
    );
    // @ts-ignore
    this.title.textContent.setOrigin(0.5, 0).setDepth(2);
  }

  createTable(): void {
    const { width, height } = this.menu.game.config;

    // @ts-ignore
    this.table = new GridTable(this.menu, width / 2, height / 2, 500, 400, {
      cellWidth: 500,
      cellHeight: 50,
      cellsCount: this.results.length,
      columns: 1,
      cellVisibleCallback: this.onCellVisible.bind(this),
      clamplTableOXY: false,
    });
    // @ts-ignore
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

    const font = '16px monospace';
    const fill = '#ffffff';

    // @ts-ignore
    const txtIdx = this.menu.add.text(20, 20, `${idx + 1}.`, { font, fill });
    // @ts-ignore
    const txtName = this.menu.add.text(35, 20, `${shortName}`, { font, fill });
    // @ts-ignore
    const txtTime = this.menu.add.text(1.7 * part, 20, `${time}`, { font, fill });
    // @ts-ignore
    const txtDate = this.menu.add.text(2.9 * part, 20, `${date || ''}`, { font, fill });
    // @ts-ignore
    const txtScore = this.menu.add.text(4.3 * part, 20, `${score}`, { font, fill });
    // txtScore.setOrigin(0.1, 0.5);

    const container = this.menu.add.container(0, 0,
      [...arr, txtIdx, txtName, txtTime, txtScore, txtDate]);
    return container;
  }

  createTitleRow(arr: Array<Phaser.GameObjects.Graphics>): Phaser.GameObjects.Container {
    const width = 500;
    const part = width / 5;

    const font = '25px monospace';
    const fill = '#ffffff';

    // @ts-ignore
    const txtName = this.menu.add.text(part / 2, 10, 'Name', { font, fill });
    // @ts-ignore
    const txtTime = this.menu.add.text(part * 1.75, 10, 'Time', { font, fill });
    // @ts-ignore
    const txtDate = this.menu.add.text(part * 3, 10, 'Date', { font, fill });
    // @ts-ignore
    const txtScore = this.menu.add.text(part * 4, 10, 'Score', { font, fill });

    const container = this.menu.add.container(0, 0,
      [...arr, txtName, txtTime, txtScore, txtDate]);
    return container;
  }

  createBackBtn(): void {
    const { width, height } = this.menu.game.renderer;

    this.backBtn = this.menu.createBtn(width / 2, height * 0.82, 'Back');

    this.backBtn.on('pointerdown', () => {
      this.removeBestScore();
      this.menu.main.init();
    });
  }

  removeBestScore(): void {
    this.title.destroy();
    // @ts-ignore
    this.title.textContent.destroy();
    // @ts-ignore
    this.table.destroy();
    this.backBtn.destroy();
    // @ts-ignore
    this.backBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
