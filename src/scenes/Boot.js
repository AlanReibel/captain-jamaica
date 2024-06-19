import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {

        this.loadAudios();
        this.loadImages();
        this.loadSpriteSheets();
        this.loadTileMaps();

    }

    create() {
        this.scene.start('Preloader');
    }

    loadAudios() {
        this.load.audio('bitest','assets/sounds/bitest.mp3');
        this.load.audio('laser','assets/sounds/laser2.mp3');
        this.load.audio('punch','assets/sounds/punch.mp3');
        this.load.audio('boomerang','assets/sounds/boomerang2.mp3');
        this.load.audio('die','assets/sounds/retro_die_02.mp3');

    }

    loadSpriteSheets() {
        this.load.spritesheet('captain-idle',
            'assets/sprites/captain/idle.png',
            { frameWidth: 64, frameHeight: 58 }
        );

        this.load.spritesheet('captain-run',
            'assets/sprites/captain/run.png',
            { frameWidth: 64, frameHeight: 58 }
        );

        this.load.spritesheet('captain-fight',
            'assets/sprites/captain/fight.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.spritesheet('shield-throw',
            'assets/sprites/captain/shield-throw.png',
            { frameWidth: 75, frameHeight: 64 }
        );

        this.load.spritesheet('shield-fly',
            'assets/sprites/captain/shield-fly.png',
            { frameWidth: 64, frameHeight: 40 }
        );

        this.load.aseprite({
            key: 'shot',
            textureURL: 'assets/sprites/captain/shot.png',
            atlasURL: 'assets/sprites/captain/shot.json'
        });
    }

    loadImages() {
        this.load.image('background', 'assets/orange-skyline.png');
        this.load.image('bullet', 'assets/sprites/captain/bullet.png');


        this.load.image('foreground', 'assets/background/0000_foreground.png');
        this.load.image('buildings', 'assets/background/0001_buildings.png');
        this.load.image('farBuildings', 'assets/background/0002_far-buildings.png');
        this.load.image('bg', 'assets/background/0003_bg.png');
    }

    loadTileMaps() {
        // this.load.image('tilemapImage', 'assets/tiles/tilemap_packed.png');
        // this.load.tilemapTiledJSON('tilemapJson', 'assets/tiles/suelo.json');
    }
}
