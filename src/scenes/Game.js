import { Scene } from 'phaser';
import { Player } from '../objects/Player.js';
import { InputHandler } from '../objects/InputHandler.js';
import { Enemy } from '../objects/Enemy.js';

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

    enemies;
    groundLayer;
    healthBar;
    guideIsOpen = false;

    create() {
        this.cameras.main.fadeIn( 200, 0, 0, 0 );

        this.gameOver = false;
        this.player = new Player(this, 100, 400, 'captain-idle');
        this.inputHandler = new InputHandler(this);

        this.addBackground();
        this.playMusic();
        this.addTileMaps();
        this.createCamera();
        this.createEnemies();

        console.log('game scene', this);
        const guideButton = document.querySelector('#guideButton');

        guideButton.classList.add('visible');
        guideButton.addEventListener('pointerdown', () => {
            if (this.guideIsOpen) {
                this.scene.resume();
                this.guideIsOpen = false;
            }else {
                this.scene.pause();
                this.guideIsOpen = true;
            }
        });

    }

    update() {

        // reset fight
        if (this.player.body.velocity.y <= - 20) {

            this.player.movingDirection = 'down';

            if (
                this.inputHandler.isFightActionPressed() &&
                !this.player.blockedFight
            ) {
                this.player.jumpKick();
            }

        } else if (this.player.body.velocity.x == 0 && this.player.body.blocked.down) {
            this.player.movingDirection = 'none';
        }

        if (this.player.movingDirection === 'down' && this.player.body.blocked.down && this.player.fightEnds) {
            this.player.land();
            this.player.movingDirection = 'none';
        }

        if (this.inputHandler.isFightActionLeaved() && this.player.fightEnds) {
            this.player.blockedFight = false;
        }

        if (this.inputHandler.isJumpLeaved()) {
            this.player.blockedJump = false;
        }

        // fighting
        if (this.inputHandler.isFightActionPressed() && !this.player.blockedFight) {
            this.handleFightActions();
        }

        // holding keys
        // space holding
        if (this.inputHandler.qKey.isDown) {
            let duration = this.inputHandler.qKey.getDuration();

            if (duration - this.inputHandler.holdingTime <= 20 && duration - this.inputHandler.holdingTime >= 0) {
                this.inputHandler.holding['X'] = true;
                this.inputHandler.buttons['X'] = true;
            } else {
                this.inputHandler.holding['X'] = false;
                this.inputHandler.buttons['X'] = false;

            }

        }

        // E key holding
        if (this.inputHandler.eKey.isDown) {
            let duration = this.inputHandler.eKey.getDuration();

            if (duration - this.inputHandler.holdingTime <= 20 && duration - this.inputHandler.holdingTime >= 0) {
                this.inputHandler.holding['Y'] = true;
                this.inputHandler.buttons['Y'] = true;
            } else {
                this.inputHandler.holding['Y'] = false;
                this.inputHandler.buttons['Y'] = false;

            }

        }

        // hold action
        if (this.inputHandler.buttons['X'] && this.inputHandler.holding['X']) {
            this.inputHandler.holding['X'] = false;
            this.inputHandler.buttons['X'] = false;
            this.player.shieldAttack();
            this.player.blockedFight = true;
        }

        if (this.inputHandler.buttons['Y'] && this.inputHandler.holding['Y']) {
            this.inputHandler.buttons['Y'] = false;
            this.inputHandler.holding['Y'] = false;
            this.player.special();
            this.player.blockedFight = true;
        }

        // move if end of fight action
        if (this.player.fightEnds) {
            this.handleMovement();
        }
        // jump
        if (
            this.inputHandler.isJumpKeyPressed() &&
            this.player.body.blocked.down &&
            !this.player.blockedJump
        ) {
            this.player.handleJump();
        }
        // game over
        if (this.gameOver) {
            this.music.stop();
            this.scene.start('GameOver', { inputHandler: this.inputHandler});
        }

        if (this.player.anims.currentAnim.key === 'burst') {

            let currentFrame = this.player.anims.currentFrame;

            if (currentFrame.index >= 3 &&
                currentFrame.index % 2 == 1) {

                if (!this.player.bulletFired) {

                    this.player.fireBullet(this);
                    this.player.bulletFired = true;
                }

            } else {
                this.player.bulletFired = false;

            }
        } else {
            this.player.bulletFired = false;
        }

        if (this.landEnemies) {

            this.landEnemies.children.iterate((enemy) => {
                if (this.isEnemyInCameraView(enemy, this.cameras.main.worldView)) {
                    enemy.update();
                }
            });
        }

        if (this.flyingEnemies) {

            this.flyingEnemies.children.iterate((enemy) => {
                if (this.isEnemyInCameraView(enemy, this.cameras.main.worldView)) {
                    enemy.update();
                }
            });
        }

        if(!this.player.specialEnabled) {
            this.disableSpecialMarker();
        }

        if(this.player.x > 3150 && this.player.y < 70) {
            this.finishGame()
        }


    }

    handleFightActions() {
        // pressed Q key or X button
        if (
            this.inputHandler.qKey.isDown ||
            this.inputHandler.buttons['X']
        ) {
            this.player.shieldHit();

        }
        // pressed space key or B button
        else if (
            this.inputHandler.cursors.space.isDown ||
            this.inputHandler.buttons['B']
        ) {
            this.player.punch();

        }
        // pressed E key or Y button
        else if (
            this.inputHandler.eKey.isDown ||
            this.inputHandler.buttons['Y']
        ) {
            // this.player.special();
            this.player.whip();

        }
        // pressed space key or X button
        // else if (
        //     this.inputHandler.cursors.space.isDown ||
        //     this.inputHandler.buttons['X']
        // ) {


        // }


    }

    hitEnemy(enemy, damage) {
        enemy.hurt(damage);
    }

    handleMovement() {
        // pressed left or A
        if (
            this.inputHandler.cursors.left.isDown ||
            this.inputHandler.aKey.isDown ||
            this.inputHandler.joystickKeys?.left.isDown
        ) {
            this.player.move('left');
            this.moveBackground(-1);
            // this.cameras.main.scrollX -= 5;
        }
        // pressed right or D
        else if (
            this.inputHandler.cursors.right.isDown ||
            this.inputHandler.dKey.isDown ||
            this.inputHandler.joystickKeys?.right.isDown
        ) {
            this.player.move('right');
            this.moveBackground(1);
            // this.cameras.main.scrollX += 5;
        }
        // idle if else
        else {
            this.player.idle();
        }
    }

    createEnemies() {
        this.landEnemies = this.physics.add.group();
        
        this.flyingEnemies = this.physics.add.group({
            allowGravity: false,
        });

        let enemiesPositions = this.map.getObjectLayer('enemies');

        enemiesPositions.objects.forEach(enemyData => {
            let newEnemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.name);

            if (enemyData.name === 'flyingRobot') {
                this.flyingEnemies.add(newEnemy);
            } else {
                this.landEnemies.add(newEnemy);
                this.physics.add.overlap(newEnemy.bullets, this.player, this.playerFired, null, this);
                this.physics.add.collider(newEnemy.bullets, this.greenTilesLayer, this.destroyBullet, null, this);
            }

        });

        // this.physics.add.overlap(this.player.shield, this.landEnemies, this.handleHitCollision, null, this);
        this.physics.add.overlap(this.player, this.landEnemies, this.handleBodyCollision, null, this);
        this.physics.add.collider(this.player.bullets, this.landEnemies, this.handleBulletCollision, null, this);
        this.physics.add.collider(this.greenTilesLayer, this.landEnemies, null, null, this);

        // this.physics.add.overlap(this.player.shield, this.flyingEnemies, this.handleHitCollision, null, this);
        this.physics.add.overlap(this.player, this.flyingEnemies, this.handleBodyCollision, null, this);
        this.physics.add.collider(this.player.bullets, this.flyingEnemies, this.handleBulletCollision, null, this);
        this.physics.add.collider(this.greenTilesLayer, this.flyingEnemies, null, null, this);
        this.physics.add.collider(this.player.bullets, this.greenTilesLayer, this.destroyBullet, null, this);
    }

    isEnemyInCameraView(enemy, visibleArea) {
        return (
            enemy.x + enemy.width > visibleArea.x && // Verifica el lado izquierdo
            enemy.x < visibleArea.x + visibleArea.width && // Verifica el lado derecho
            enemy.y + enemy.height > visibleArea.y && // Verifica la parte superior
            enemy.y < visibleArea.y + visibleArea.height // Verifica la parte inferior
        );
    }

    destroyBullet( bullet, map) {
        bullet.destroy();
        let bulletExplosion = this.physics.add.sprite(bullet.x, bullet.y, 'explosion1');
        bulletExplosion.body.setAllowGravity(false);
        bulletExplosion.anims.play('explosion1', true);

        bulletExplosion.on('animationcomplete-explosion1', (anim, frame) => {
            bulletExplosion.destroy();
        });
    }

    playerFired(player, bullet) {

        if (this.player.vulnerable && this.player.state !== 'special') {
            this.player.vulnerable = false;
            this.player.takeDamage(bullet.damage);
            this.healthbarUpdate();
            this.destroyBullet(bullet);
        }

        this.time.delayedCall(1000, () => {
            this.player.vulnerable = true;
        });
    }

    handleBulletCollision(bullet, enemy) {

        this.hitEnemy(enemy, 20);

        if (bullet.texture.key === 'bullet') {
            bullet.destroy();
        }

    }

    handleHitCollision(shield, enemy) {
        this.hitEnemy(enemy);
    }

    handleBodyCollision(player, enemy) {
        // Verifica si el jugador está en una animación de lucha
        let damage = {
            punch: 20,
            kick: 30,
            shield: 50,
            whip: 100,
            specialExplosion: 150,
        };

        let currentState = this.player.state;
        let damageStates = [
            'punch',
            'kick',
            'whip',
            'specialExplosion',
            'shield',
        ];
        let enemyOnFront = player.focusTo === 'right' 
            ? player.x <= enemy.x
            : player.x >= enemy.x;

 
        if ( damageStates.includes(currentState) 
            && enemyOnFront
        ) {

            this.hitEnemy(enemy, damage[currentState]);
        }

        if (enemy.state === 'attacking' && this.player.vulnerable) {
            let damage = enemy.damage || 0;
            // console.log('enemy', enemy.damage);
            this.player.takeDamage(damage);
            this.player.vulnerable = false;
            this.healthbarUpdate();
            this.time.delayedCall(800, () => {
                this.player.vulnerable = true;
            });
        }
    }

    playMusic() {
        this.music = this.sound.add('bitest');
        this.music.play();
        this.music.setLoop(true);

    }

    addBackground() {

        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;

        let bgWidth = this.inputHandler.width || gamewidth;
        let bgHeight = this.inputHandler.height || gameheight;

        let x = gamewidth === bgWidth ? 0 : (bgWidth - gamewidth) / 2;
        let y = gameheight === bgHeight ? 0 : (bgHeight - gameheight) / 2;

        this.bg1 = this.add.tileSprite(x, y, gamewidth, gameheight, 'bg1')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg2 = this.add.tileSprite(x, y, gamewidth, gameheight, 'bg2')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg3 = this.add.tileSprite(x, y, gamewidth, gameheight, 'bg3')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg4 = this.add.tileSprite(x, y, gamewidth, gameheight, 'bg4')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg5 = this.add.tileSprite(x, y, gamewidth, gameheight, 'bg5')
            .setScrollFactor(0)
            .setOrigin(0, 0);

        this.addHealthBar( x, y);
        this.addSpecialUI(gamewidth);
    }

    moveBackground(direction) {
        // Actualiza la posición del tileSprite en función de la posición de la cámara

        let scroll = this.cameras.main.scrollX / 20;

        this.bg1.tilePositionX = scroll * 0.2;
        this.bg2.tilePositionX = scroll * 0.5;
        this.bg3.tilePositionX = scroll * 1;
        this.bg4.tilePositionX = scroll * 2;
        this.bg5.tilePositionX = scroll * 3;
    }

    createCamera() {

        this.physics.world
            .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cameras.main
            // .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
            .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
            // .startFollow(this.player, true, 0.5, 0, 200, 0)
            .startFollow(this.player, true, 1, 0.1, 0, 0)
            // .setZoom(1.5)
            // .zoomTo(this.player, 1000)
            // .centerOn(0,this.map.heightInPixels)
            // .setSize(800, 600)
            .setFollowOffset(0, -50);
    }

    addTileMaps() {
        this.map = this.make.tilemap({ key: 'tilemapJson' });

        const greenTiles = this.map.addTilesetImage('greenTiles2', 'tilemapImage2');
        this.greenTilesLayer = this.map.createLayer('greenPlatforms', greenTiles);

        const objectTiles = this.map.addTilesetImage('newObjectSet', 'objectsTilemap');
        const backObjectLayer = this.map.createLayer('background', objectTiles);
        const frontObjectLayer = this.map.createLayer('foreground', objectTiles);

        backObjectLayer.setDepth(0);
        frontObjectLayer.setDepth(3);
        this.greenTilesLayer
            .setDepth(1)
            .setCollisionByProperty({ collider: true });
        this.physics.add.collider(this.player, this.greenTilesLayer);
        // this.physics.add.collider(this.player, collisionBoxes);

    }

    addHealthBar( x, y ) {
        this.uiContainer = this.add.container(x, y);
        this.uiContainer.setScrollFactor(0)
            .setDepth(3);


        let health = this.player.health;
        let healthbarBackground = this.add.graphics();
        healthbarBackground
            .fillStyle(0xbb2300, 1)
            .fillRect(10, 10, health, 15);
        // Crear un gráfico para la barra de vida
        this.healthBar = this.add.graphics();
        this.healthBar
            .fillStyle(0x00c749, 1)
            .fillRect(10, 10, health, 15);

        this.uiContainer.add(healthbarBackground);
        this.uiContainer.add(this.healthBar);

    }

    healthbarUpdate() {
        this.healthBar.clear();
        this.healthBar
            .fillStyle(0x00c749, 1)
            .fillRect(10, 10, this.player.health, 15);

        if (this.player.health <= 0) {
            this.gameOver = true;
        }
    }

    addSpecialUI( width ) {
        let x = width - 25;
        let specialMarker = this.add.image(x, 20, 'specialMarker');
        specialMarker.setScale(0.4);
        this.specialMarkerFX = specialMarker.postFX.addColorMatrix();
        this.uiContainer.add(specialMarker);
    }

    disableSpecialMarker() {
        this.specialMarkerFX.blackWhite();
    }

    finishGame () {
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.scene.start('Finish', { inputHandler: this.inputHandler});
    }

}
