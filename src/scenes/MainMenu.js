import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'splash');

        // this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'logo');

        // this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Captain Jamaica Prototype', {
        //     fontFamily: 'Arial Black', fontSize: 19, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);

        this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Click / Touch to Start', {
            fontFamily: 'Courier', 
            fontSize: 15, 
            color: '#f6e800',
            stroke: '#000000', 
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {


            this.cameras.main.fadeOut(250, 0, 0, 0);

            this.cameras.main.once('camerafadeoutcomplete', function (camera) {

                this.scene.start('Game');
    
    
            }, this);

        });
    }
}
