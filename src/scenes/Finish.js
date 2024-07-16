import { Scene } from 'phaser';

export class Finish extends Scene
{
    constructor ()
    {
        super('Finish');
    }

    init(data) {
        this.inputHandler = data.inputHandler;
    }

    preload() {
        this.load.image('finish', 'assets/finish.png');
    }
    create () {

        console.log('Finish', this);

        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;

        let bgWidth = this.inputHandler?.width || gamewidth;
        let bgHeight = this.inputHandler?.height || gameheight;

        let screenSize = this.inputHandler?.screenSize || { width: gamewidth, height: gameheight};

        let x = gamewidth === bgWidth ? 0 : (bgWidth - gamewidth) / 2;
        let y = gameheight === bgHeight ? 0 : (bgHeight - gameheight) / 2;

        let scale = bgWidth / gamewidth;

        console.log('scale',scale);
        console.log('bgWidth',bgWidth);
        console.log('gamewidth',gamewidth);
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

        let fontConfig = {
            fontFamily: 'Courier', 
            fontSize: 20, 
            color: '#f6e800',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        };

        this.add.image(screenSize.width / 2, screenSize.height / 2, 'finish')
            // .setOrigin(0)
            .setAlpha(0.8)
            .setScale(scale);

        let congrats = this.add.text(screenSize.width / 2, (screenSize.height / 2) - 30, 'Congrats!', { ...fontConfig,fontSize: 40}).setOrigin(0.5);
        let success = this.add.text(screenSize.width / 2, (screenSize.height / 2) + 30, 'You have successfully finished!', fontConfig).setOrigin(0.5);

        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            yoyo: false,
            onUpdate: (tween) => {

                const v = tween.getValue();

                congrats.setFontSize(30 + v * 10);
            }
        });

        this.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            yoyo: false,
            onUpdate: (tween) => {

                const v = tween.getValue();

                success.setFontSize(10 + v * 10);
            }, 
            onComplete: () => {
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
                color: '#f6e800',
                stroke: '#000000', 
                strokeThickness: 2,
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.game.sound.stopAll();
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
