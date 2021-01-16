/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-useless-constructor */
import Phaser from 'phaser';


export class MenuScene extends Phaser.Scene {
    constructor () {
        super ({key: 'MenuScene' })
    }

   

    create() {
        this.add.image(0, 0, 'menu_bg').setOrigin(0).setDepth(0)
        this.add.image(this.game.renderer.width/ 2 , this.game.renderer.height * 0.20, 'logo').setDepth(1)
        const playBtn = this.add.image(this.game.renderer.width/ 2, this.game.renderer.height / 2, 'play_btn').setDepth(1)
        const optionsBtn = this.add.image(this.game.renderer.width/ 2, this.game.renderer.height / 2 + 100, 'options_btn').setDepth(1)
        // const hoverSprite = this.add.sprite(100, 100, 'cat')
        const hoverSprite = this.add.sprite(100, 100, 'scull')
        hoverSprite.setScale(0.6)
        hoverSprite.setVisible(false)

        playBtn.setInteractive()
        optionsBtn.setInteractive()

        playBtn.on('pointerover', () => {
            hoverSprite.setVisible(true)
            hoverSprite.x = playBtn.x - playBtn.width
            hoverSprite.y = playBtn.y
        })

        playBtn.on('pointerout', () => {
            hoverSprite.setVisible(false)
            hoverSprite.x = playBtn.x - playBtn.width
            hoverSprite.y = playBtn.y
        })

        optionsBtn.on('pointerover', () => {
            hoverSprite.setVisible(true)
            hoverSprite.x = optionsBtn.x - optionsBtn.width
            hoverSprite.y = optionsBtn.y
        })

        optionsBtn.on('pointerout', () => {
            hoverSprite.setVisible(false)
            hoverSprite.x = optionsBtn.x - optionsBtn.width
            hoverSprite.y = optionsBtn.y
        })

        playBtn.on('pointerdown', () => {
            this.scene.start('GameScene')
        })
        // this.add.image('options_btn')
    }
}
