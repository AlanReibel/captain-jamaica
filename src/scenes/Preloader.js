import { Scene } from 'phaser';
import { Enemy } from '../objects/Enemy';
import { Animal } from '../objects/Animal';
import { Box } from '../objects/Box';
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
        this.loadBgImages();
        this.loadHudImages();
        this.loadSpriteSheets();
        this.loadTileMaps();
        this.loadFXSprites();


    }

    create() {

        Player.createAnimations(this);
        Enemy.createAnimations(this);
        Animal.createAnimations(this);
        Box.createAnimations(this);
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
        
        let barBorder = this.add.rectangle(200, 150, 300, 31);
        barBorder.setStrokeStyle(1, 0x000000);

        const bar = this.add.rectangle(200, 150, 298, 30, 0xf6e800);

        this.load.on('progress', (progress) => {

            bar.width = 4 + (300 * progress);

        });
    }

    loadAudios() {

        let audioList = [
            'enemy-die',
            'enemy-shot',
            'enemy-punch',
            'pre-punch',
            'player-punch',
            'player-fire',
            'jump',
            'land',
            'hurt',
            'shield',
            'boomerang',
            'whip',
            'hit',
            'special',
            'explosion',
            'chest',
            'item',
            'increase',
            'error',
        ];

        audioList.forEach( audio => {
            this.load.audio(audio,`sounds/${audio}.mp3`);
        });
        // main
        this.load.audio('bitest','sounds/bitest.mp3');


    }

    loadSpriteSheets() {

        this.captainSprites();

        Enemy.loadResources(this);
        Animal.loadResources(this);

        this.boxSprites();
        this.uiImages();

    }

    loadBgImages() {
        this.load.image('bullet', 'sprites/captain/bullet.png');


        this.load.image('bg1', 'background/1.png');
        this.load.image('bg2', 'background/2.png');
        this.load.image('bg3', 'background/3.png');
        this.load.image('bg4', 'background/4.png');
        this.load.image('bg5', 'background/5.png');
    }

    loadHudImages() {
        this.load.image('specialMarker', 'ui/special.png');
        this.load.image('healthIcon', 'ui/health.png');
        this.load.image('powerIcon', 'ui/power.png');

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

    loadFXSprites() {
        this.load.spritesheet('explosion1',
            'sprites/fx/explosion1.png',
            { frameWidth: 25, frameHeight: 24 }
        );
    }

    boxSprites() {
        this.load.spritesheet('chest',
            'sprites/boxes/chest.png',
            { frameWidth: 32, frameHeight: 32 }
        );
    }

    uiImages() {
        this.load.image('power', 'sprites/boxes/power.png');
        this.load.image('health', 'sprites/boxes/health.png');
        this.load.image('ammo', 'sprites/boxes/ammo.png');
    }
}
