import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background');

        // this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'logo');

        this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Captain Jamaica Prototype', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
