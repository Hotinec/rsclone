interface IVocabulary {
 // main
 readonly newGame: string,
 readonly options: string,
 readonly bestScore: string,
 readonly about: string,
 readonly loadingState: string,
 readonly finishState: string,
 readonly resumeState: string,
 readonly pauseState: string,
 // score
 readonly nameTitle: string,
 readonly timeTitle: string,
 readonly dateTitle: string,
 readonly scoreTitle: string,
 readonly healthTitle: string,
 // options
 readonly volume: string,
 readonly fullScreen: string,
 readonly language: string,
 readonly back: string,
 // about
 readonly up: string,
 readonly down: string,
 readonly left: string,
 readonly right: string,
 readonly KNIFE: string,
 readonly PISTOL: string,
 readonly SHORTGUN: string,
 readonly RIFLE: string,
 readonly run: string,
 readonly weapon: string,
 readonly aboutText1: string,
 readonly aboutText2: string,
 readonly chooseTheme: string,
 readonly createdBy: string,
 readonly darkTheme: string,
 readonly lightTheme: string,
 // gameOver
 readonly gameOverState: string,
 readonly save: string,
 readonly gameOverText: string,
 readonly mainMenu: string,
}

export interface ILanguage{
    readonly lang: string,
    vocabulary: IVocabulary
}
