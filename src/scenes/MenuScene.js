/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';

import backgound from '../assets/menu/bg.jpg'
import logo from '../assets/menu/logo.png'
import scull from '../assets/menu/scull.png'
import emptyScull from '../assets/menu/scull-empty.png'
import theme from '../assets/audio/theme1.mp3'
import title from '../assets/menu/empty.png'
import btn from '../assets/menu/small.png'
import MainMenu from '../menus/Main'
import OptionsMenu from '../menus/Options'


export class MenuScene extends Phaser.Scene {
    constructor () {
        super ({key: 'MenuScene' })
        this.sound = true
        this.fullScreen = false
        this.texts = []
    }

    preload() {
        this.load.audio('theme', theme)
        this.load.image('menu_bg', backgound, 0, 0)
        this.load.image('logo', logo)
        this.load.image('scull', scull)
        this.load.image('title', title)
        this.load.image('btn', btn)
        this.load.image('empty-scull', emptyScull)
    }

    create() {
        this.audio = this.sound.add('theme');
        this.audio.setVolume(1)
        this.audio.play()
        this.createBG()
        this.main = new MainMenu(this)
        this.options = new OptionsMenu(this)
      
        this.main.init()
     
        this.hoverImg = this.add.image(100, 100, 'scull')
        this.hoverImg.setVisible(false)
        this.hoverImg.setScale(0.4)
    }

    createBG() {
        const bg = this.add.image(0, 0, 'menu_bg').setDepth(0)
        bg.displayHeight = this.game.config.height
        bg.scaleX = bg.scaleY
        
        bg.y  = this.game.config.height/2
        bg.x = this.game.config.width/2

        // bg.x = bg.displayWidth*.5
    }

    createBtn(x, y, text, arr){
        const btn = this.add.image(x, y, 'btn').setDepth(1)
        const btnText = this.make.text({
           x, y, text,
            style: {
                font: '27px monospace',
                fill: '#212121'
            }
        })
        btnText.setOrigin(0.5, 0.5).setDepth(2)
        this.initHover(btn)
        arr.push(btnText)

        return btn
    }

    initHover(btn) {
        btn.setInteractive()

        btn.on('pointerover', () => {
            this.hoverImg.setVisible(true)
            this.hoverImg.x = btn.x - this.hoverImg.width
            this.hoverImg.y = btn.y
        })

        btn.on('pointerout', () => {
            this.hoverImg.setVisible(false)
        })   
    }

    
}