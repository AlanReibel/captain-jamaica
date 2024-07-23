import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('splash', 'assets/captain-splash.png');
        
        this.loadIntroAudios();
        this.loadIntroImages();
    }

    create() {
        this.input.once('pointerdown', () => {
            this.scene.start('Intro');
        })

        this.addStartButton();

    }

    loadIntroAudios() {
        this.load.audio('keySound1', 'assets/sounds/typewrite/key1.mp3');
        this.load.audio('keySound2', 'assets/sounds/typewrite/key2.mp3');
        this.load.audio('keySound3', 'assets/sounds/typewrite/key3.mp3');
        this.load.audio('spaceSound', 'assets/sounds/typewrite/spaceBar.mp3');
        this.load.audio('enterSound', 'assets/sounds/typewrite/newLine.mp3');
        this.load.audio('introMusic', 'assets/sounds/intro.mp3');
    }

    loadIntroImages() {
        this.load.image('devasted-city', 'assets/intro/devasted-city.png');
        this.load.image('shoting', 'assets/intro/shoting.png');
        this.load.image('lying', 'assets/intro/lying.png');
        this.load.image('elixir', 'assets/intro/elixir.png');
        this.load.image('effects', 'assets/intro/effects.png');
        this.load.image('reborn', 'assets/intro/reborn.png');

    }

    addStartButton() {
        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;

        let skip = this.add.text(
            gamewidth / 2, 
            gameheight / 2, 
            'START', 
            {
                fontFamily: 'Courier', 
                fontSize: 20, 
                color: '#ffffff',
                // stroke: '#ffffff', 
                // strokeThickness: 2,
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Intro');

        })

        this.tweens.add({
            targets: skip,
            duration: 500,
            y: gameheight / 2 + 1,
            // scale: 0.9,
            yoyo: true,
            repeat: -1,
        });

    }

}
