export default class MainMenu {
    constructor(scene) {
        this.menu = scene
        this.btnsTexts = []
    }

    init() {
        this.createMainMenu()
        this.initClicks()
    }

    createMainMenu() {
        this.createLogo()

        const width = this.menu.game.renderer.width
        const height = this.menu.game.renderer.height
        
        this.playBtn = this.menu.createBtn(width/ 2, height / 2 + 50, 'New Game', this.btnsTexts)
        this.optionsBtn = this.menu.createBtn(width/ 2, height / 2 + 150, 'Options', this.btnsTexts)
    }

    initClicks() {
        this.playBtn.on('pointerdown', () => {
            this.menu.audio.stop()
            this.menu.scene.start('LoadScene')
          
        })
        this.optionsBtn.on('pointerdown', () => {
          this.removeMainMenu()
          this.menu.options.init()    
        })
    }

    createLogo() {
        const MAX_WIDTH = 1400
        const MIDDLE_WIDTH = 1000
        const WIDTH = this.menu.game.config.width
        this.logo = this.menu.add.image(WIDTH / 2 , this.menu.game.config.height * 0.20, 'logo').setDepth(1)
        
        if(WIDTH < MAX_WIDTH && WIDTH > MIDDLE_WIDTH) {
            this.logo.scaleX = this.logo.scaleY * .8
        }

        if(WIDTH < MIDDLE_WIDTH) {
            this.logo.scaleX = this.logo.scaleY * .7
        }
    }

    removeMainMenu() {
        this.logo.destroy()
        this.playBtn.destroy()
        this.optionsBtn.destroy()
        this.menu.hoverImg.setVisible(false)
        this.btnsTexts.forEach(el => el.destroy())
        this.btnsTexts = []
    }




}