import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    preload() {
        this.load.image('flag', 'assets/jamaica-flag.png');
    }
    create () {
        let fontConfig = {
            fontFamily: 'Courier', 
            fontSize: 100, 
            color: '#f6e800',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        };

        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'flag').setAlpha(0.8);

        let game = this.add.text(this.game.config.width / 2, (this.game.config.height / 2) - 30, 'Game', fontConfig).setOrigin(0.5);
        let over = this.add.text(this.game.config.width / 2, (this.game.config.height / 2) + 30, 'Over', fontConfig).setOrigin(0.5);

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
                this.addRestartButton();
            }
        });

    }

    addRestartButton() {
        let restart = this.add.text(
            this.game.config.width / 2, 
            (this.game.config.height / 2) + 100, 
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
            this.scene.start('MainMenu');
        })

        this.tweens.add({
            targets: restart,
            duration: 500,
            y: (this.game.config.height / 2) + 105,
            yoyo: true,
            repeat: -1,
        });

    }
}
