import GridTable from 'phaser3-rex-plugins/plugins/gridtable';
// import { GridTable } from 'phaser3-rex-plugins/templates/ui/ui-components';
// import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';
import { GameOverScene } from '../scenes/GameOverScene';

export default class Score {
  constructor(scene) {
    this.menu = scene;
    this.results = GameOverScene.getResults();
  }

  init() {
    this.sortResults();
    this.createTitle();
    this.createTable();
    this.createBackBtn();
  }

  sortResults() {
    this.results.sort((a, b) => b.score - a.score);
  }

  createTitle() {
    const { width, height } = this.menu.game.renderer;

    this.title = this.menu.add.image(width / 2,
      height * 0.14, 'title');
    this.title.textContent = this.menu.make.text(
      {
        x: width / 2,
        y: height * 0.14,
        text: 'Best Score',
        style: {
          font: '40px monospace',
          fill: '#212121',
        },
      },
    );
    this.title.textContent.setOrigin(0.5, 0.1).setDepth(2);
  }

  createTable() {
    const { width, height } = this.menu.game.config;

    this.table = new GridTable(this.menu, width / 2, height / 2, 500, 400, {
      cellWidth: 500,
      cellHeight: 50,
      cellsCount: this.results.length,
      columns: 1,
      cellVisibleCallback: this.onCellVisible.bind(this),
      clamplTableOXY: false,
    });
    this.table.setOrigin(0.5, 0.5);
  }

  onCellVisible(cell) {
    const newCellObject = this.createCellObj(cell);

    cell.setContainer(newCellObject);
  }

  createCellObj(cell) {
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

  createResultRow(idx, arr) {
    const width = 500;
    const part = width / 4;

    const {
      time, score, name, date,
    } = this.results[idx];

    const shortName = name.length < 12 ? name : name.slice(0, 12);

    const font = '16px monospace';
    const fill = '#ffffff';

    const txtIdx = this.menu.add.text(6, 20, `${idx + 1}.`, { font, fill });
    const txtName = this.menu.add.text(30, 20, `${shortName}`, { font, fill });
    const txtTime = this.menu.add.text(part + 40, 20, `${time}`, { font, fill });
    const txtDate = this.menu.add.text(2 * part + 40, 20, `${date || ''}`, { font, fill });
    const txtScore = this.menu.add.text(3 * part + 70, 20, `${score}`, { font, fill });
    // txtScore.setOrigin(0.1, 0.5);

    const container = this.menu.add.container(0, 0,
      [...arr, txtIdx, txtName, txtTime, txtScore, txtDate]);
    return container;
  }

  createTitleRow(arr) {
    const width = 500;
    const part = width / 4;

    const font = '25px monospace';
    const fill = '#ffffff';

    const txtName = this.menu.add.text(46, 10, 'Name', { font, fill });
    const txtTime = this.menu.add.text(part + 46, 10, 'Time', { font, fill });
    const txtDate = this.menu.add.text(2 * part + 46, 10, 'Date', { font, fill });
    const txtScore = this.menu.add.text(3 * part + 46, 10, 'Score', { font, fill });

    const container = this.menu.add.container(0, 0,
      [...arr, txtName, txtTime, txtScore, txtDate]);
    return container;
  }

  createBackBtn() {
    const { width, height } = this.menu.game.renderer;

    this.backBtn = this.menu.createBtn(width / 2, height * 0.82, 'Back');

    this.backBtn.on('pointerdown', () => {
      this.removeBestScore();
      this.menu.main.init();
    });
  }

  removeBestScore() {
    this.title.destroy();
    this.title.textContent.destroy();
    this.table.destroy();
    this.backBtn.destroy();
    this.backBtn.textContent.destroy();
    this.menu.hoverImg.setVisible(false);
  }
}
