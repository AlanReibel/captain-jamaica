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
    create ()
    {
        let fontConfig = {
            fontFamily: 'Courier', 
            fontSize: 100, 
            color: '#f6e800',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        };

        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'flag').setAlpha(0.8);

        this.add.text(this.game.config.width / 2, (this.game.config.height / 2) - 50, 'Game', fontConfig).setOrigin(0.5);
        this.add.text(this.game.config.width / 2, (this.game.config.height / 2) + 50, 'Over', fontConfig).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
