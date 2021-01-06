/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';
// import Hero from '../models';
import earth from '../../../assets/scorched_earth.png';
import sceleton from '../../../assets/skeleton8.png';
// import playerBodyHandgunPng  from '../../../assets/hero/handgun/move/survivor-move_handgun.png';
// import survivorMoveHandgunJSON  from '../../../assets/hero/handgun/move/survivor-move_handgun.json';
// import feetPng from '../../../assets/hero/feet/feet.png';
// import feetJSON from '../../../assets/hero/feet/feet.json';

const directions = {
  west: { offset: 0, x: -2, y: 0, opposite: 'east' },
  northWest: { offset: 32, x: -2, y: -1, opposite: 'southEast' },
  north: { offset: 64, x: 0, y: -2, opposite: 'south' },
  northEast: { offset: 96, x: 2, y: -1, opposite: 'southWest' },
  east: { offset: 128, x: 2, y: 0, opposite: 'west' },
  southEast: { offset: 160, x: 2, y: 1, opposite: 'northWest' },
  south: { offset: 192, x: 0, y: 2, opposite: 'north' },
  southWest: { offset: 224, x: -2, y: 1, opposite: 'northEast' }
};

const anims = {
  idle: {
      startFrame: 0,
      endFrame: 4,
      speed: 0.2
  },
  walk: {
      startFrame: 4,
      endFrame: 12,
      speed: 0.15
  },
  attack: {
      startFrame: 12,
      endFrame: 20,
      speed: 0.11
  },
  die: {
      startFrame: 20,
      endFrame: 28,
      speed: 0.2
  },
  shoot: {
      startFrame: 28,
      endFrame: 32,
      speed: 0.1
  }
};

const skeletons = [];

// GameObject Skeleton
class Skeleton extends Phaser.GameObjects.Image {
  constructor(scene, x, y, motion, direction, distance) {
    super(scene, x, y, 'skeleton', direction.offset);
    
    this.scene = scene;

    this.startX = x;
    this.startY = y;
    this.distance = distance;

    this.motion = motion;
    this.anim = anims[motion];
    this.direction = directions[direction];
    this.speed = 0.15;
    this.f = this.anim.startFrame;

    this.depth = y + 64;

    scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
    console.log(direction.offset)
  }

  changeFrame () {
    this.f++;

    let delay = this.anim.speed;

    if (this.f === this.anim.endFrame) {
      switch (this.motion) {
        case 'walk':
          this.f = this.anim.startFrame;
          this.frame = this.texture.get(this.direction.offset + this.f);
          this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
          break;

        case 'attack':
          delay = Math.random() * 2;
          this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
          break;

        case 'idle':
          delay = 0.5 + Math.random();
          this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
          break;

        case 'die':
          delay = 6 + Math.random() * 6;
          this.scene.time.delayedCall(delay * 1000, this.resetAnimation, [], this);
          break;
      }
    } else {
      console.log(this.scene)
      this.frame = this.texture.get(this.direction.offset + this.f);

      this.scene.time.delayedCall(delay * 1000, this.changeFrame, [], this);
    }
  }

  resetAnimation () {
    this.f = this.anim.startFrame;
    this.frame = this.texture.get(this.direction.offset + this.f);
    this.scene.time.delayedCall(this.anim.speed * 1000, this.changeFrame, [], this);
  }

  update () {
    if (this.motion === 'walk') {
      this.x += this.direction.x * this.speed;

      if (this.direction.y !== 0) {
        this.y += this.direction.y * this.speed;
        this.depth = this.y + 64;
      }

       //  Walked far enough?
      if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance){
        this.direction = directions[this.direction.opposite];
        this.f = this.anim.startFrame;
        this.frame = this.texture.get(this.direction.offset + this.f);
        this.startX = this.x;
        this.startY = this.y;
      }
    }
  }
}

export class GameScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('earth', earth);

    this.load.spritesheet(
      'skeleton', 
      sceleton, 
      { frameWidth: 128, frameHeight: 128 }
    );

    // this.load.atlas('player-body-handgun', playerBodyHandgunPng, survivorMoveHandgunJSON);
    // this.load.atlas('player-feet', feetPng, feetJSON);
  }

  create () {
    // TODO Fix *2
    this.add.tileSprite(
      0, 
      0, 
      window.innerWidth * 2,
      window.innerHeight * 2, 
      'earth'
    );

    // this.player = new Hero(this);

    skeletons.push(this.add.existing(new Skeleton(this, 240, 290, 'walk', 'southEast', 100)));
        skeletons.push(this.add.existing(new Skeleton(this, 100, 380, 'walk', 'southEast', 230)));
        skeletons.push(this.add.existing(new Skeleton(this, 620, 140, 'walk', 'south', 380)));
        skeletons.push(this.add.existing(new Skeleton(this, 460, 180, 'idle', 'south', 0)));

        skeletons.push(this.add.existing(new Skeleton(this, 760, 100, 'attack', 'southEast', 0)));
        skeletons.push(this.add.existing(new Skeleton(this, 800, 140, 'attack', 'northWest', 0)));

        skeletons.push(this.add.existing(new Skeleton(this, 750, 480, 'walk', 'east', 200)));

        skeletons.push(this.add.existing(new Skeleton(this, 1030, 300, 'die', 'west', 0)));

        skeletons.push(this.add.existing(new Skeleton(this, 1180, 340, 'attack', 'northEast', 0)));

        skeletons.push(this.add.existing(new Skeleton(this, 1180, 180, 'walk', 'southEast', 160)));

        skeletons.push(this.add.existing(new Skeleton(this, 1450, 320, 'walk', 'southWest', 320)));
        skeletons.push(this.add.existing(new Skeleton(this, 1500, 340, 'walk', 'southWest', 340)));
        skeletons.push(this.add.existing(new Skeleton(this, 1550, 360, 'walk', 'southWest', 330)));
  }

  update() {
    skeletons.forEach(function (skeleton) {
      skeleton.update();
    });
  }
}

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ababab',
  parent: 'game',
  scene: [ GameScene ]
};

const game = new Phaser.Game(config);