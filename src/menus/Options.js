export default class OptionsMenu {
    constructor(scene) {
        this.menu = scene
        this.x = this.menu.game.renderer.width / 2
        this.y = this.menu.game.renderer.height
        this.btnsTexts = []
        this.volumeIndicatorsOn = []
        this.volumeIndicatorsOff = []
        this.btwDistanse = 70
        this.operationNum = 0

    }

    init() {
        this.menu.hoverImg.setScale(0.3)
        this.createTitle()
        this.createSoundOpt()
        this.createVolumeSet()
        this.createFSOpt()
        this.createBackBtn()
        this.initClicks()
    }

    checkSize() {
        const MIDDLE_WIDTH = 1000
        const MIDDLE_HEIGHT = 700
        const WIDTH = this.menu.game.config.width 
        const HEIGHT = this.menu.game.config.height

        if(WIDTH < MIDDLE_WIDTH && MIDDLE_HEIGHT < HEIGHT) {
            this.btwDistanse = 50
        }
    }

    createTitle() {
        this.title = this.menu.add.image(this.x, 
            this.y * .1 , 'title')
        const titleText = this.menu.make.text({
            x: this.x,
            y: this.y * .1,
            text: 'Options',
            style: {
                font: '40px monospace',
                fill: '#212121'
            }
         })
         titleText.setOrigin(0.5, 0.1).setDepth(2)
        this.btnsTexts.push(titleText )
    }

    createSoundOpt() {
        const y = this.y * .3 

        this.soundTitle = this.menu.add.image(this.x , y+this.operationNum*this.btwDistanse , 'btn')
        const titleText = this.menu.make.text({
            x: this.x,
            y: y,
            text: 'Sound',
            style: {
                font: '30px monospace',
                fill: '#212121'
            }
         })
        titleText.setOrigin(0.5, 0.5).setDepth(2)
        this.operationNum++
        this.btnsTexts.push(titleText )
        this.soundOnBtn = this.menu.createBtn(this.x - this.soundTitle.width / 2, y+this.operationNum*this.btwDistanse , 'On', this.btnsTexts)
        this.soundOffBtn = this.menu.createBtn(this.x + this.soundTitle.width / 2, y+this.operationNum*this.btwDistanse , 'Off', this.btnsTexts)
        this.operationNum++
    }

    createFSOpt() {
        const y = this.y * .3 

        this.FSTitle = this.menu.add.image(this.x , y+this.operationNum*this.btwDistanse , 'btn')
        const titleText = this.menu.make.text({
            x: this.x,
            y: y+this.operationNum*this.btwDistanse,
            text: 'FullScreen',
            style: {
                font: '30px monospace',
                fill: '#212121'
            }
         })
        titleText.setOrigin(0.5, 0.5).setDepth(2)
        this.btnsTexts.push(titleText )
        this.operationNum++
        this.fullscreenOn = this.menu.createBtn(this.x - this.soundTitle.width / 2, y+this.operationNum*this.btwDistanse , 'On', this.btnsTexts)
        this.fullscreenOff = this.menu.createBtn(this.x + this.soundTitle.width / 2, y+this.operationNum*this.btwDistanse, 'Off', this.btnsTexts)
        this.operationNum++
    }

    createVolumeSet() {
        const y = this.y * .3 

        this.volumeTitle = this.menu.add.image(this.x , y+this.operationNum*this.btwDistanse, 'btn')
        const volumeText = this.menu.make.text({
            x: this.x,
            y: y+this.operationNum*this.btwDistanse,
            text: 'Volume',
            style: {
                font: '30px monospace',
                fill: '#212121'
            }
         })
        this.operationNum++  
        this.volumeBox = this.menu.add.image(this.x , y+this.operationNum*this.btwDistanse, 'btn')
        this.volumeBox.setVisible(false)
        this.createVolumeIndicator()
        this.operationNum++  
        volumeText.setOrigin(0.5, 0.5).setDepth(2)
        this.btnsTexts.push(volumeText)
    }

    createVolumeIndicator() {
        for (let i = 0; i < 5; i++){
         this.createVolumeRange(i, 'empty-scull', this.volumeIndicatorsOff) 
         this.createVolumeRange(i, 'scull', this.volumeIndicatorsOn) 
        }

    }

    createVolumeRange(i, btn, arr) {
        const width = this.volumeBox.x - this.volumeBox.width/2.5
        const y = this.y* .3 +this.operationNum*this.btwDistanse
        const img = this.menu.add.image(100, 100, btn).setDepth(3)
        img.setScale(.25)
        img.x = width + img.width * .25 * i + img.width * .25
        img.y = y
        img.id = i
        img.setInteractive()
        arr.push(img)
    }

    createBackBtn() {
        const y = this.y * .3

        this.backBtn = this.menu.createBtn(this.x, y+this.operationNum*this.btwDistanse , 'Back', this.btnsTexts)
    }

    initClicks() {
        this.soundOffBtn.on('pointerdown', () => {
            if(!this.menu.sound) return 

            this.menu.sound = false
            this.menu.audio.pause()
        }) 
        this.soundOnBtn.on('pointerdown', () => {
            if(this.sound) return 
            this.menu.sound = true
            this.menu.audio.resume()
        }) 

        this.fullscreenOn.on('pointerdown', () => {
            if (!this.menu.scale.isFullscreen){                
                this.menu.scale.startFullscreen()
            }
        });

        this.fullscreenOff.on('pointerdown', () => {
            if (this.menu.scale.isFullscreen){                
                this.menu.scale.stopFullscreen()
            }
        })

        this.backBtn.on('pointerdown', () => {
            this.removeOptionsMenu()
            this.menu.main.init()
        })

        this.volumeIndicatorsOff.forEach((el, idx) => {
            el.on('pointerdown', () => {
                this.setVolumeUp(idx)
            })
        })

        this.volumeIndicatorsOn.forEach((el, idx) => {
            el.on('pointerdown', () => {
                this.setVolumeDown(idx)
            })
        })
    }

    setVolumeUp(idx) {
        const n = +`0.${idx*2}`
        this.menu.audio.setVolume(n)
        
        for(let i = 0; i <= idx; i++){
            console.log(this.volumeIndicatorsOn[i], idx)
            this.volumeIndicatorsOn[i].setVisible(true)
        }
  
    }

    setVolumeDown(idx) {
        const n = +`0.${idx*2}`
        this.menu.audio.setVolume(n)

        for(let i = this.volumeIndicatorsOn.length -1; idx <= i; i--){
            console.log(this.volumeIndicatorsOn[i], idx)
            this.volumeIndicatorsOn[i].setVisible(false)
        }
    }

    removeOptionsMenu() {
        this.title.destroy()
        this.backBtn.destroy()
        this.volumeTitle.destroy()
        this.volumeBox.destroy()
        this.FSTitle.destroy()
        this.soundTitle.destroy()
        this.soundOnBtn.destroy()
        this.soundOffBtn.destroy()
        this.fullscreenOff.destroy()
        this.fullscreenOn.destroy()
        this.menu.hoverImg.setVisible(false)
        this.btnsTexts.forEach(el => el.destroy())
        this.volumeIndicatorsOn.forEach(el => el.destroy())
        this.volumeIndicatorsOff.forEach(el => el.destroy())
        this.volumeIndicatorsOn = []
        this.volumeIndicatorsOff = []
        this.btnsTexts = []
        this.operationNum = 0
    }

}