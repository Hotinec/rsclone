/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';

import loadBg from '../assets/menu/loadBG.jpg' 
import backgound from '../assets/menu/bg.jpg'
import option_btn from '../assets/menu/options_button.png'
import play_btn from '../assets/menu/play_button.png'
import logo from '../assets/menu/logo.png'
import scull from '../assets/menu/scull.png'


export class LoadScene extends Phaser.Scene {
    constructor () {
        super ({key: 'LoadScene' })
    }

    preload() {
        this.load.image('load_bg', loadBg, 0, 0)
        this.add.image(0, 0, 'load_bg')
        this.load.image('menu_bg', backgound, 0, 0)
        this.load.image('options_btn', option_btn)
        this.load.image('play_btn', play_btn)
        this.load.image('logo', logo)
        this.load.image('scull', scull)

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
        // loadingBox.fillRect(240, this.game.renderer.height / 2, 320, 50)

        // // for (let i = 0; i < 100; i++){
        //     this.load.spritesheet('cat' + i, cat, {
        //         frameWidth: 32,
        //         frameHeight: 32
        //     })    
        // }

        this.load.on('progress', (percent) => {
            loadingBar.clear()
            loadingBar.fillStyle(0XFFFFFF)
            loadingBar.fillRect(width / 3 + 20, height / 2 + 10, width / 3 * percent, 30).setDepth(1)
        })


    }

    create() {
        this.scene.start('MenuScene')
    }


}