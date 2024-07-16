import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { MainMenu } from './scenes/MainMenu.js';
import { Game } from './scenes/Game.js';
import { UIScene } from './scenes/UIScene.js';
import { GameOver } from './scenes/GameOver.js';
import { Finish } from './scenes/Finish.js';
import { Intro } from './scenes/Intro.js';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    parent: 'game-container',
    // backgroundColor: '#028af8',
    fullscreenTarget: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            // debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        UIScene,
        GameOver,
        Finish,
        Intro
    ],
    plugins: {
        global: [{
            key: 'rexVirtualJoystick',
            plugin: VirtualJoystickPlugin,
            start: true
        },
        // ...
        ]
    },
    input: {
        activePointers: 3 // Permitir hasta 3 punteros activos
    }
};

export default new Phaser.Game(config);
