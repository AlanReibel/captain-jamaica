import { Scene } from 'phaser';
import { Player } from '../objects/Player.js';
import { InputHandler } from '../objects/InputHandler.js';

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
    movingDirection = 'right';
    blockedFight = false;
    fightEnds = true;
    shieldThrown = false;
    shieldCached = true;
    enemy;

    create() {
        this.gameOver = false;
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background');
        this.add.image(400, 300, 'background');
        this.showGuideText();

        this.player = new Player(this, 100, 400, 'captain-idle');
        this.inputHandler = new InputHandler(this);
        this.inputHandler.addVirtualJoystick();

        this.createEnemy();
    }

    update() {
        // reset fight state
        if (this.inputHandler.isFightActionLeaved()) {
            this.blockedFight = false;
            // this.fightEnds = true;
        }
        // fighting
        if (this.inputHandler.isFightActionPressed() && !this.blockedFight) {
            this.handleFightActions();
        }
        // move if end of fight action
        if (this.fightEnds) {
            this.handleMovement();
        }
        // jump
        if (this.inputHandler.isJumpKeyPressed() && this.player.sprite.body.blocked.down) {
            this.player.sprite.setVelocityY(-550);
            this.player.sprite.body.setGravityY(600);
        }
        // game over
        if (this.gameOver) {
            this.scene.start('GameOver');
        }

    }

    handleFightActions() {
        // pressed Q key or A button
        if (
            this.inputHandler.qKey.isDown ||
            this.inputHandler.buttons['A']
        ) {

            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('punch', true);
        }
        // pressed E key or B button
        else if (
            this.inputHandler.eKey.isDown ||
            this.inputHandler.buttons['B']
        ) {

            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('kick', true);
        }
        // pressed F key or Y button
        else if (
            this.inputHandler.fKey.isDown ||
            this.inputHandler.buttons['Y']
        ) {
            this.blockedFight = true;
            this.fightEnds = false;

            if (this.shieldCached && !this.shieldThrown) {
                this.shieldThrown = true;
                this.throwShield();
            }

        }
        // pressed space key or X button
        else if (
            this.inputHandler.cursors.space.isDown ||
            this.inputHandler.buttons['X']
        ) {
            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('shield', true);
        }
    }

    handleMovement() {
        // pressed left or A
        if (
            this.inputHandler.cursors.left.isDown || 
            this.inputHandler.aKey.isDown ||
            this.inputHandler.joystickKeys.left.isDown
        ) {
            this.movingDirection = 'left';
            this.player.sprite.setVelocityX(-200);
            this.player.sprite.anims.play('run', true).setFlipX(true);
        }
        // pressed right or D
        else if (
            this.inputHandler.cursors.right.isDown || 
            this.inputHandler.dKey.isDown ||
            this.inputHandler.joystickKeys.right.isDown
        ) {
            this.movingDirection = 'right';
            this.player.sprite.setVelocityX(200);
            this.player.sprite.anims.play('run', true).setFlipX(false);
        }
        // idle if else
        else {
            this.player.sprite.setVelocityX(0);
            this.player.sprite.anims.play('idle', true);
        }
    }

    throwShield() {
        this.player.sprite.anims.play('throw', true);
        this.time.delayedCall(375, () => {
            // calcula posicion del escudo desde el player
            let shieldPosition = {
                x: this.movingDirection == 'right'
                    ? this.player.sprite.x + (this.player.sprite.body.width / 2)
                    : this.player.sprite.x - (this.player.sprite.body.width / 2),
                y: this.player.sprite.y
            };
            this.player.shield.setPosition(shieldPosition.x, shieldPosition.y);

            this.player.shield.setVisible(true);
            this.player.shield.play('fly', true);

            let shieldTarget = this.movingDirection == 'right'
                ? shieldPosition.x + 300
                : shieldPosition.x - 300;
            // Configurar el movimiento del escudo
            this.tweens.add({
                targets: this.player.shield,
                x: shieldTarget, // Ajusta la distancia según tus necesidades
                y: shieldPosition.y, // Ajusta la trayectoria según tus necesidades
                duration: 333,
                ease: 'Power1',
                onComplete: () => {
                    this.flyBackTween();
                }
            });
        });
    }

    flyBackTween() {
        this.tweens.add({
            targets: this.player.shield,
            x: this.player.sprite.x, // Regresa el escudo al jugador
            y: this.player.sprite.y,
            duration: 333,
            ease: 'Power1',
            onComplete: () => {
                this.player.shield.setVisible(false); // Hace que el escudo sea invisible después de regresar
                this.shieldThrown = false;
                this.shieldCached = true;
                this.player.sprite.anims.play('catch', true);
            }
        });
    }

    destroyEnemy(shield, enemy) {
        enemy.destroy();
        console.log('enemy overlap');
        this.createEnemy();
    }

    createEnemy() {
        let position = this.player.sprite.x < (this.game.config.width / 2)
            ? this.game.config.width - 50
            : 50;
        this.enemy = this.add.rectangle(position, this.game.config.height - 50, 50, 50, 0x00ff00);

        // Opcional: Habilitar física para el enemigo
        this.physics.add.existing(this.enemy);

        // Configurar propiedades físicas si es necesario
        this.enemy.body.setCollideWorldBounds(true);
        // this.enemy.body.setBounce(1, 1); // Ejemplo de rebote si lo necesitas
        this.physics.add.collider(this.player.shield, this.enemy, this.destroyEnemy, null, this);
        this.physics.add.overlap(this.player.sprite, this.enemy, this.handleBodyCollision, null, this);

    }

    handleBodyCollision(player, enemy) {
        // Verifica si el jugador está en una animación de lucha
        const currentAnim = player.anims.currentAnim.key;
        if (currentAnim === 'punch' || currentAnim === 'kick' || currentAnim === 'shield') {
            this.destroyEnemy( null,enemy);
        }
    }

    showGuideText() {
        let fontSetup = {
            fontFamily: 'Arial Black', 
            fontSize: 15, 
            color: '#000000',
            // stroke: '#000000', 
            // strokeThickness: 2,
            align: 'center'
        };
        this.add.text(20, 20, 'WSAD or arrow keys to move', fontSetup);
        this.add.text(20, 40, 'Q key for punch', fontSetup);
        this.add.text(20, 60, 'E key for kick', fontSetup);
        this.add.text(20, 80, 'SPACE key for shield attack', fontSetup);
        this.add.text(20, 100, 'F key for shield throw', fontSetup);
    }

}
