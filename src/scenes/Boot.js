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

        this.load.spritesheet('shield-throw',
            'assets/sprites/captain/shield-throw.png',
            { frameWidth: 600, frameHeight: 512 }
        );

        this.load.spritesheet('shield-fly',
            'assets/sprites/captain/shield-fly.png',
            { frameWidth: 256, frameHeight: 160 }
        );

        this.load.image('bullet', 'assets/sprites/captain/bullet.png');


        // this.load.spritesheet('shot', 
        //     'assets/sprites/captain/shot.png',
        //     { frameWidth: 512, frameHeight: 512 }
        // );

        this.load.aseprite({
            key: 'shot',
            textureURL: 'assets/sprites/captain/shot.png',
            atlasURL: 'assets/sprites/captain/shot.json'
        });


        this.load.audio('bitest','assets/sounds/bitest.mp3');
        // this.load.image('tilemapImage', 'assets/tiles/tilemap_packed.png');
        // this.load.tilemapTiledJSON('tilemapJson', 'assets/tiles/suelo.json');

    }

    create() {
        this.scene.start('Preloader');
    }
}
