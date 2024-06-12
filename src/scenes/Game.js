import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { InputHandler } from '../objects/InputHandler';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    player;
    inputHandler;
    score = 0;
    textScore;
    lives = 3;
    textLives;
    gameOver = false;
    map;
    movingDirection = 1;
    blockedFight = false;
    fightEnds = true;

    create() {
        this.gameOver = false;
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background');
        this.add.image(400, 300, 'background');

        this.player = new Player(this, 100, 400, 'captain-idle');
        this.inputHandler = new InputHandler(this);
    }

    update() {
        if (this.inputHandler.resetFightState()) {
            this.blockedFight = false;
            this.fightEnds = true;
        }

        if (this.inputHandler.isFightActionPressed() && !this.blockedFight) {
            this.handleFightActions();
        }

        if (this.fightEnds) {
            this.handleMovement();
        }

        if (this.inputHandler.isJumpKeyPressed() && this.player.sprite.body.blocked.down) {
            this.player.sprite.setVelocityY(-550);
            this.player.sprite.body.setGravityY(600);
        }

        if (this.gameOver) {
            this.scene.start('GameOver');
        }
    }

    handleFightActions() {
        if (this.inputHandler.qKey.isDown) {
            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('punch', true);
        } else if (this.inputHandler.eKey.isDown) {
            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('kick', true);
        } else if (this.inputHandler.cursors.space.isDown) {
            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('shield', true);
        }
    }

    handleMovement() {
        if (this.inputHandler.cursors.left.isDown || this.inputHandler.aKey.isDown) {
            this.player.sprite.setVelocityX(-200);
            this.player.sprite.anims.play('run', true).setFlipX(true);
        } else if (this.inputHandler.cursors.right.isDown || this.inputHandler.dKey.isDown) {
            this.player.sprite.setVelocityX(200);
            this.player.sprite.anims.play('run', true).setFlipX(false);
        } else {
            this.player.sprite.setVelocityX(0);
            this.player.sprite.anims.play('idle', true);
        }
    }
}
