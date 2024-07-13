import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    init(data) {
        this.inputHandler = data.inputHandler || false;
    }

    create () {
        let x = 0;
        let y = 0;
        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;
        let scale = 1;
        let screenSize;
        let bgWidth;
        let bgHeight

        if(this.inputHandler) {
    
            bgWidth = this.inputHandler.width || gamewidth;
            bgHeight = this.inputHandler.height || gameheight;
            screenSize = this.inputHandler.screenSize;
            scale = bgWidth / gamewidth;
            x = gamewidth === bgWidth ? 0 : (bgWidth - gamewidth) / 2;
            y = gameheight === bgHeight ? 0 : (bgHeight - gameheight) / 2;
    
            
            if(this.inputHandler.isMobile) {
                
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

            
        console.log('bg size', {bgWidth, bgHeight} );
        console.log('game size', {gamewidth, gameheight} );
        // console.log('screen size', {width: screenSize.width, height: screenSize.height} );


        }

        console.log('main menu', this);
        this.add
            .image(x, y, 'splash')
            .setOrigin(0)
            .setScale(scale);

        // this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'logo');

        // this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Captain Jamaica Prototype', {
        //     fontFamily: 'Arial Black', fontSize: 19, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5);

        let textX = this.inputHandler.isMobile ? x + (bgWidth / 2) : x + (gamewidth / 2);
        let textY = this.inputHandler.isMobile ? y + (bgHeight / 2) : y + (gameheight / 2);

        // console.log('text pos', { textX, textY});
        // console.log('original pos', { x, y});

        this.add.text(textX, textY, 'Click / Touch to Start', {
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
