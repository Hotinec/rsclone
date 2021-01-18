/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';

// //Hero
// import  knife from '../assets/player/body/knife/knife.png';
// import knifeAtlas from '../assets/player/body/knife/knife_atlas.json';
// import knifeAnim from '../assets/player/body/knife/knife_anim.json';
// //Laser
// import laser from '../assets/weapon/laser.png';
// //Player
// import feet from '../assets/player/feet/feet.png';
// import feetAtlas from '../assets/player/feet/feet_atlas.json';
// import feetAnim from '../assets/player/feet/feet_anim.json';
// //weapon
// import pistol from '../assets/weapon/pistol.png';
// import rifle from '../assets/weapon/rifle.png';
// import shotgun from '../assets/weapon/shotgun.png';
// //zombie
// import townMaleAtlas from '../assets/zombie/zombie_atlas.json';
// import townMale from '../assets/zombie/zombie.png';
// import maleAnim from '../assets/zombie/zombie_anim.json';
// //map
// import terrain from '../assets/map/terrain.png';
// import map from '../assets/map/map.json'


export class LoadScene extends Phaser.Scene {
    constructor () {
        super ({key: 'LoadScene' })
    }

    preload() {
        this.showLoading()
    //         //player
    // this.load.atlas('feet', feet, feetAtlas);
    // this.load.animation('feet_anim', feetAnim);
    // this.load.atlas('body_knife', knife, knifeAtlas);
    // this.load.animation('knife_anim', knifeAnim);
    // //laser
    // this.load.image('laser', laser);
    // //hero
    // this.load.atlas('knife', knife, knifeAtlas);
    // this.load.animation('knife_anim', knifeAnim);
    // //weapon
    // this.load.image('pistol', pistol);
    // this.load.image('rifle', rifle);
    // this.load.image('shotgun', shotgun); 
    // //zombie
    // this.load.atlas(
    //     'zombie',
    //     townMale,
    //     townMaleAtlas
    //   );
    //   this.load.animation('zombie_anim', maleAnim);
    //   this.load.image('tilesets', terrain);
    //   this.load.tilemapTiledJSON('map', map);
    }

    showLoading() {

        const width = this.cameras.main.width
        const height = this.cameras.main.height

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 30,
            text: 'Loading',
            style: {
                font: '25px monospace',
                fill: '#fff'
            }
        })
        loadingText.setOrigin(0.5, 0.5)

        const loadingBox = this.add.graphics()
        loadingBox.fillStyle(0X222222, 0.8) 
        loadingBox.fillRect(width / 3, height / 2, width / 3 + 40, 50)

        const loadingBar = this.add.graphics()

        this.load.on('progress', (percent) => {
            loadingBar.clear()
            loadingBar.fillStyle(0XFFFFFF)
            loadingBar.fillRect(width / 3 + 20, height / 2 + 10, width / 3 * percent, 30).setDepth(1)
        })
    }

    create() {
        this.scene.start('GameScene')
    }
}