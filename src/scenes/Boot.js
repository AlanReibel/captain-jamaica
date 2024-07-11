import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('splash', 'assets/captain-splash.png');
    }

    create() {
        this.scene.start('Preloader');
    }


}
