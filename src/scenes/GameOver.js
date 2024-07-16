import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init(data) {
        this.inputHandler = data.inputHandler;
    }

    preload() {
        this.load.image('flag', 'assets/jamaica-flag.png');
    }
    create () {

        console.log('game over', this);

        let fontConfig = {
            fontFamily: 'Courier', 
            fontSize: 100, 
            color: '#f6e800',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        };

        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;

        let bgWidth = this.inputHandler?.width || gamewidth;
        let bgHeight = this.inputHandler?.height || gameheight;

        let screenSize = this.inputHandler?.screenSize || { width: gamewidth, height: gameheight};

        let x = gamewidth === bgWidth ? 0 : (bgWidth - gamewidth) / 2;
        let y = gameheight === bgHeight ? 0 : (bgHeight - gameheight) / 2;

        let scale = bgWidth / gamewidth;

        
        if(this.inputHandler?.isMobile) {
            
            switch (this.inputHandler.orientation) {
                case 'portrait':
                    x = 0;
                    y = (screenSize.height - bgHeight) / 2;
                    break;
                case 'landscape':
                    x = (screenSize.width - bgWidth) / 2;
                    y = 0;
                    break;

            }
        }

        this.add.image(x, y, 'flag')
            .setOrigin(0)
            .setAlpha(0.8)
            .setScale(scale);

        let game = this.add.text(screenSize.width / 2, (screenSize.height / 2) - 30, 'Game', fontConfig).setOrigin(0.5);
        let over = this.add.text(screenSize.width / 2, (screenSize.height / 2) + 30, 'Over', fontConfig).setOrigin(0.5);

        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            yoyo: false,
            onUpdate: (tween) => {

                const v = tween.getValue();

                game.setFontSize(20 + v * 64);
            }
        });

        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            yoyo: false,
            onUpdate: (tween) => {

                const v = tween.getValue();

                over.setFontSize(20 + v * 64);
            }, onComplete: () => {
                game.destroy();
                over.destroy();
                this.addCredits(screenSize);
                this.addRestartButton(screenSize);
            }
        });

    }

    addRestartButton(screenSize) {
        let restart = this.add.text(
            screenSize.width / 2, 
            (screenSize.height / 2) + 100, 
            'RESTART', 
            {
                fontFamily: 'Courier', 
                fontSize: 25, 
                color: '#000',
                stroke: '#000000', 
                strokeThickness: 2,
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('MainMenu', { inputHandler: this.inputHandler});
        })

        this.tweens.add({
            targets: restart,
            duration: 500,
            y: (screenSize.height / 2) + 105,
            yoyo: true,
            repeat: -1,
        });

    }

    addCredits(screenSize) {
        let fontConfig = {
            fontFamily: 'Courier', 
            fontSize: this.inputHandler?.isMobile && this.inputHandler.orientation === 'portrait' 
                ? screenSize.width / 40 
                :screenSize.height / 25, 
            color: '#f6e800',
            stroke: '#000000', 
            strokeThickness: 5,
            align: 'center'
        };

        let creditText = `Credits 
Original History & Main Char Design & Animations: 
Oral Ferguson 

Programing, Music & Sound:
Alan Reibel

Other Graphics (Backgrounds, Tiles & Enemies): 
craftpix.net

Typewriter Sounds:
pixabay.com
`;
        let gameText = this.add.text(
            screenSize.width / 2, 
            (screenSize.height / 2) - 30, 
            creditText, 
            fontConfig
        ).setOrigin(0.5);
        gameText.setWordWrapWidth(screenSize.width / 2);

    }

}
