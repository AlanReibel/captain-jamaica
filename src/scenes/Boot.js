import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/orange-skyline.png');

        this.load.spritesheet('captain-idle',
            'assets/sprites/captain/idle.png',
            { frameWidth: 512, frameHeight: 465 }
        );

        this.load.spritesheet('captain-run',
            'assets/sprites/captain/run.png',
            { frameWidth: 512, frameHeight: 465 }
        );

        this.load.spritesheet('captain-fight',
            'assets/sprites/captain/fight.png',
            { frameWidth: 512, frameHeight: 512 }
        );


        // this.load.image('tilemapImage', 'assets/tiles/tilemap_packed.png');
        // this.load.tilemapTiledJSON('tilemapJson', 'assets/tiles/suelo.json');

    }

    create() {
        this.scene.start('Preloader');
    }
}
