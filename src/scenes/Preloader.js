import { Scene } from 'phaser';
import { Enemy } from '../objects/Enemy';
import { Player } from '../objects/Player';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(0, 0, 'splash').setOrigin(0);

        this.addProgressBar();
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.loadAudios();
        this.loadImages();
        this.loadSpriteSheets();
        this.loadTileMaps();
        this.loadFXSprites();


    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        Player.createAnimations(this);
        Enemy.createAnimations(this);
        this.defineFXAnimations();

        this.scene.start('MainMenu');

    }

    defineFXAnimations() {
        this.anims.create({
            key: 'explosion1',
            frames: this.anims.generateFrameNumbers('explosion1', { start: 0, end: 11 }),
            frameRate: 24,
            repeat: 0
        });
    }

    addProgressBar() {
        //  A simple progress bar. This is the outline of the bar.
        let barBorder = this.add.rectangle(200, 150, 300, 31);
        barBorder.setStrokeStyle(1, 0x000000);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(200, 150, 298, 30, 0xf6e800);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (300 * progress);

        });
    }

    loadAudios() {
        // main
        this.load.audio('bitest','sounds/bitest.mp3');
        // enemy
        this.load.audio('die','sounds/laser1.mp3');
        this.load.audio('enemyPunch','sounds/punch3.mp3');
        this.load.audio('enemyShot','sounds/laser3.mp3');
        // captain
        this.load.audio('laser','sounds/laser2.mp3');
        this.load.audio('punch','sounds/punch3.mp3');
        this.load.audio('special','sounds/boomerang.mp3');
        this.load.audio('boomerang','sounds/boomerang2.mp3');
        this.load.audio('explosion','sounds/explosion.mp3');

    }

    loadSpriteSheets() {

        this.captainSprites();
        this.enemiesSprites();

    }

    loadImages() {
        this.load.image('bullet', 'sprites/captain/bullet.png');


        this.load.image('bg1', 'background/1.png');
        this.load.image('bg2', 'background/2.png');
        this.load.image('bg3', 'background/3.png');
        this.load.image('bg4', 'background/4.png');
        this.load.image('bg5', 'background/5.png');
        this.load.image('specialMarker', 'ui/special.png');
    }
    
    loadTileMaps() {
        // this.load.image('tilemapImage', 'tiles/Tileset.png');
        this.load.image('tilemapImage2', 'tiles/greenTiles2.png');
        this.load.image('objectsTilemap', 'tiles/newObjectSet.png');
        this.load.tilemapTiledJSON('tilemapJson', 'tiles/world.json');
    }

    captainSprites() {
        this.load.spritesheet('captain-idle',
            'sprites/captain/idle.png',
            { frameWidth: 64, frameHeight: 58 }
        );

        this.load.spritesheet('captain-run',
            'sprites/captain/run.png',
            { frameWidth: 64, frameHeight: 58 }
        );

        this.load.spritesheet('captain-fight',
            'sprites/captain/fight.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.spritesheet('shield-throw',
            'sprites/captain/shield-throw.png',
            { frameWidth: 75, frameHeight: 64 }
        );

        this.load.spritesheet('shield-fly',
            'sprites/captain/shield-fly.png',
            { frameWidth: 64, frameHeight: 40 }
        );

        this.load.spritesheet('special',
            'sprites/captain/special.png',
            { frameWidth: 128, frameHeight: 92 }
        );

        this.load.spritesheet('whip',
            'sprites/captain/whip.png',
            { frameWidth: 135, frameHeight: 64 }
        );

        this.load.aseprite({
            key: 'shot',
            textureURL: 'sprites/captain/shot.png',
            atlasURL: 'sprites/captain/shot.json'
        });
    }

    enemiesSprites() {

        Enemy.loadResources(this);

    }

    loadFXSprites() {
        this.load.spritesheet('explosion1',
            'sprites/fx/explosion1.png',
            { frameWidth: 25, frameHeight: 24 }
        );
    }
}
