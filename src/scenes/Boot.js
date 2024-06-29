import { Scene } from 'phaser';
import { Enemy } from '../objects/Enemy';

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
        this.load.audio('punch','assets/sounds/punch3.mp3');
        this.load.audio('boomerang','assets/sounds/boomerang2.mp3');
        this.load.audio('die','assets/sounds/explosion.mp3');

    }

    loadSpriteSheets() {

        this.captainSprites();
        this.enemiesSprites();

    }

    loadImages() {
        this.load.image('background', 'assets/orange-skyline.png');
        this.load.image('bullet', 'assets/sprites/captain/bullet.png');


        this.load.image('bg1', 'assets/background/1.png');
        this.load.image('bg2', 'assets/background/2.png');
        this.load.image('bg3', 'assets/background/3.png');
        this.load.image('bg4', 'assets/background/4.png');
        this.load.image('bg5', 'assets/background/5.png');
    }
    
    loadTileMaps() {
        this.load.image('tilemapImage', 'assets/tiles/Tileset.png');
        this.load.image('objectsTilemap', 'assets/tiles/objects.png');
        this.load.tilemapTiledJSON('tilemapJson', 'assets/tiles/world.json');
    }

    captainSprites() {
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

        this.load.spritesheet('special',
            'assets/sprites/captain/special.png',
            { frameWidth: 128, frameHeight: 92 }
        );

        this.load.spritesheet('whip',
            'assets/sprites/captain/whip.png',
            { frameWidth: 96, frameHeight: 52 }
        );

        this.load.aseprite({
            key: 'shot',
            textureURL: 'assets/sprites/captain/shot.png',
            atlasURL: 'assets/sprites/captain/shot.json'
        });
    }

    enemiesSprites() {

        Enemy.loadResources(this);
        // this.load.once('complete', () => {
        //     Enemy.createAnimations(this);
        // });
        // this.load.start(); // Empieza la carga de recursos
    }
}
