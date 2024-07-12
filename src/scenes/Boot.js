import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('splash', 'assets/captain-splash.png');
    }

    create() {
        this.input.once('pointerdown', () => {
            this.scene.start('Intro');
        })

        this.addSkipButton();

    }

    addSkipButton() {
        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;

        let skip = this.add.text(
            gamewidth / 2, 
            gameheight / 2, 
            'START', 
            {
                fontFamily: 'Courier', 
                fontSize: 20, 
                color: '#ffffff',
                // stroke: '#ffffff', 
                // strokeThickness: 2,
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Intro');

        })

        this.tweens.add({
            targets: skip,
            duration: 500,
            y: gameheight / 2 + 1,
            // scale: 0.9,
            yoyo: true,
            repeat: -1,
        });

    }

}
