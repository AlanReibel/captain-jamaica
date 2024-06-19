import { Scene } from 'phaser';
import { Player } from '../objects/Player.js';
import { InputHandler } from '../objects/InputHandler.js';
import { Bullet } from '../objects/Bullet.js';

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
    focusTo = 'right';
    blockedFight = false;
    fightEnds = true;
    shieldThrown = false;
    shieldCached = true;
    enemy;
    bulletFired = false;

    create() {
        this.addBackground();

        this.gameOver = false;
        this.player = new Player(this, 100, 400, 'captain-idle');
        this.inputHandler = new InputHandler(this);

        // this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background');
        // this.add.image(400, 300, 'background');
        // this.showGuideText();


        console.log('game scene', this);

        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        this.createEnemy();

        this.playMusic();

        this.createCamera();

    }

    update() {
        // reset fight
        if (this.player.sprite.body.velocity.x == 0) {
            this.movingDirection = 'none';
        }
        if (this.player.sprite.body.velocity.y > 0) {
            this.movingDirection = 'down';
            if (
                this.inputHandler.isFightActionPressed() &&
                !this.blockedFight
            ) {
                this.fightEnds = false;
                this.blockedFight = true;
                this.player.sprite.anims.play('jumpKick');
            }
        }

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
        if (
            this.inputHandler.isJumpKeyPressed() &&
            this.player.sprite.body.blocked.down
        ) {
            this.handleJump();
        }
        // game over
        if (this.gameOver) {
            this.scene.start('GameOver');
        }

        // console.log('currentAnim',this.player.sprite.anims.currentAnim.key);
        if (this.player.sprite.anims.currentAnim.key === 'burst') {

            let currentFrame = this.player.sprite.anims.currentFrame;

            if (currentFrame.index >= 3 &&
                currentFrame.index % 2 == 1) {

                if (!this.bulletFired) {

                    this.fireBullet(this);
                    this.bulletFired = true;
                }

            } else {
                this.bulletFired = false;

            }
        } else {
            this.bulletFired = false;
        }
        // console.log('player velocity', this.player.sprite.body.velocity);
        // console.log('player direction', this.movingDirection);
    }

    handleJump() {
        this.movingDirection = 'up';
        this.player.sprite.setVelocityY(-550);
        this.player.sprite.body.setGravityY(600);
        this.player.sprite.anims.play('jump');
    }
    handleFightActions() {
        let punchSound = this.sound.add('punch');
        // pressed Q key or A button
        if (
            this.inputHandler.qKey.isDown ||
            this.inputHandler.buttons['A']
        ) {

            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('burst', true);
            // this.fireBullet(this);
        }
        // pressed E key or B button
        else if (
            this.inputHandler.eKey.isDown ||
            this.inputHandler.buttons['B']
        ) {

            this.blockedFight = true;
            this.fightEnds = false;
            this.player.sprite.anims.play('kick', true);
            punchSound.play();
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
            this.time.delayedCall( 100, () => {
                punchSound.play();
            });
        }
    }

    fireBullet(scene) {
        let laserSound = this.sound.add('laser');
        laserSound.setVolume(0.4);
        let playerBodyoffest = this.focusTo == 'right'
            ? this.player.sprite.body.width * 0.5
            : this.player.sprite.body.width * -0.5;

        let bulletOrigin = scene.player.sprite.x + playerBodyoffest;
        let bullet = scene.bullets.get(bulletOrigin, scene.player.sprite.y);
        if (bullet) {
            bullet.fire(bulletOrigin, scene.player.sprite.y, this.focusTo);
            laserSound.play();

        } else {
            console.log('No hay balas disponibles');
        }
    }

    handleMovement() {
        // pressed left or A
        if (
            this.inputHandler.cursors.left.isDown ||
            this.inputHandler.aKey.isDown ||
            this.inputHandler.joystickKeys?.left.isDown
        ) {
            this.movingDirection = 'left';
            this.focusTo = 'left';
            this.player.sprite.setVelocityX(-200);
            this.player.sprite.anims.play('run', true).setFlipX(true);
            this.moveBackground(-1);
        }
        // pressed right or D
        else if (
            this.inputHandler.cursors.right.isDown ||
            this.inputHandler.dKey.isDown ||
            this.inputHandler.joystickKeys?.right.isDown
        ) {
            this.movingDirection = 'right';
            this.focusTo = 'right';
            this.player.sprite.setVelocityX(200);
            this.player.sprite.anims.play('run', true).setFlipX(false);
            this.moveBackground(1);
        }
        // idle if else
        else {
            this.player.sprite.setVelocityX(0);
            this.player.sprite.anims.play('idle', true);
        }
    }

    throwShield() {
        let boomerangSound = this.sound.add('boomerang');
        this.time.delayedCall(400, () => {
            boomerangSound.play();
        });
        this.player.sprite.anims.play('throw', true);
        this.time.delayedCall(375, () => {
            // calcula posicion del escudo desde el player
            let shieldPosition = {
                x: this.focusTo == 'right'
                    ? this.player.sprite.x + (this.player.sprite.body.width / 2)
                    : this.player.sprite.x - (this.player.sprite.body.width / 2),
                y: this.player.sprite.y
            };
            this.player.shield.setPosition(shieldPosition.x, shieldPosition.y);

            this.player.shield.setVisible(true);
            this.player.shield.play('fly', true);

            let shieldTarget = this.focusTo == 'right'
                ? shieldPosition.x + 300
                : shieldPosition.x - 300;

            this.tweens.add({
                targets: this.player.shield,
                x: shieldTarget,
                y: shieldPosition.y,
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
            x: this.player.sprite.x,
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
        let dieSound = this.sound.add('die');
        dieSound.setVolume(0.4);
        enemy.destroy();
        dieSound.play();
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
        this.physics.add.collider(this.player.sprite, this.enemy, this.handleBodyCollision, null, this);
        this.physics.add.collider(this.bullets, this.enemy, this.handleBulletCollision, null, this);

    }

    handleBodyCollision(player, enemy) {
        // Verifica si el jugador está en una animación de lucha
        const currentAnim = player.anims.currentAnim.key;
        if (currentAnim === 'punch' || currentAnim === 'kick' || currentAnim === 'shield') {
            this.destroyEnemy(null, enemy);
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

    handleBulletCollision(bullet, enemy) {
        this.destroyEnemy(null, enemy);
        bullet.destroy();
    }

    playMusic() {
        let music = this.sound.add('bitest');
        // music.on('play', listener);
        music.play();
        music.setLoop(true);

    }

    addBackground() {

        this.bg = this.add.tileSprite(0, 0, 800, 600, 'bg')
            .setOrigin(0, 0);
        this.farBuildings = this.add.tileSprite(0, 0, 800, 600, 'farBuildings')
            .setOrigin(0, 0);
        this.buildings = this.add.tileSprite(0, 100, 800, 600, 'buildings')
            .setOrigin(0, 0);
        this.foreground = this.add.tileSprite(0, 0, 800, 600, 'foreground')
            .setOrigin(0, 0);
    }

    moveBackground(direction) {
        this.bg.tilePositionX += 0.2 * direction;
        this.farBuildings.tilePositionX += 0.5 * direction;
        this.buildings.tilePositionX += 1 * direction;
        this.foreground.tilePositionX += 2 * direction;
    }

    createCamera() {

        this.cameras.main.setBounds(0, 0, 800, 600);  
        this.physics.world.setBounds(0, 0, 800, 600); 
        this.cameras.main.setSize(800, 600);
        this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0, 200, 0);
        this.cameras.main.setFollowOffset(-200, 0);

    }

}
