import { Scene } from 'phaser';
import { Player } from '../objects/Player.js';
import { InputHandler } from '../objects/InputHandler.js';
import { Bullet } from '../objects/Bullet.js';
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
    movingDirection = 'right';
    focusTo = 'right';
    blockedFight = false;
    blockedJump = false;
    fightEnds = true;
    shieldThrown = false;
    shieldCached = true;
    enemies;
    bulletFired = false;
    groundLayer;

    create() {
        this.addBackground();

        this.gameOver = false;
        this.player = new Player(this, 100, 400, 'captain-idle');
        this.player.sprite.setDepth(1);
        this.inputHandler = new InputHandler(this);

        // this.showGuideText();


        console.log('game scene', this);

        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });


        this.playMusic();


        this.addTileMaps();
        this.createCamera();

        this.createMultipleEnemies();


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
        if (this.inputHandler.isJumpLeaved()) {
            this.blockedJump = false;
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
            this.player.sprite.body.blocked.down &&
            !this.blockedJump
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

        if( this.landEnemies ) {

            this.landEnemies.children.iterate((enemy) => {
                enemy.update();
            });
        }

        if(this.flyingEnemies) {

            this.flyingEnemies.children.iterate((enemy) => {
                enemy.update();
            });
        }
        // console.log('player velocity', this.player.sprite.body.velocity);
        // console.log('player direction', this.movingDirection);
    }

    handleJump() {
        this.blockedJump = true;
        this.movingDirection = 'up';
        this.player.sprite.setVelocityY(-400);
        this.player.sprite.body.setGravityY(400);
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
            this.time.delayedCall(100, () => {
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
        let velocity = 100;
        if (
            this.inputHandler.cursors.left.isDown ||
            this.inputHandler.aKey.isDown ||
            this.inputHandler.joystickKeys?.left.isDown
        ) {
            this.movingDirection = 'left';
            this.focusTo = 'left';
            this.player.sprite.setVelocityX(velocity * -1);
            this.player.sprite.anims.play('run', true).setFlipX(true);
            this.moveBackground(-1);
            // this.cameras.main.scrollX -= 5;
        }
        // pressed right or D
        else if (
            this.inputHandler.cursors.right.isDown ||
            this.inputHandler.dKey.isDown ||
            this.inputHandler.joystickKeys?.right.isDown
        ) {
            this.movingDirection = 'right';
            this.focusTo = 'right';
            this.player.sprite.setVelocityX(velocity);
            this.player.sprite.anims.play('run', true).setFlipX(false);
            this.moveBackground(1);
            // this.cameras.main.scrollX += 5;
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

    hitEnemy(shield, enemy) {
        let dieSound = this.sound.add('die');
        // dieSound.setVolume(0.4);
        enemy.hurt();
        dieSound.play();
    }

    createMultipleEnemies() {
        this.landEnemies = this.physics.add.group();
        this.flyingEnemies = this.physics.add.group({
            allowGravity: false,
        });

        const enemiesList = [
            'flyingRobot',
            'weelRobot',
            'basebolHitter',
            'mutantDog',
            'brainTank'
        ];

        enemiesList.forEach( enemyName => {
            Enemy.createAnimations(this, enemyName);
        });

        let enemiesPositions = this.map.getObjectLayer('enemies');
        console.log('enemiesPositions',enemiesPositions);
        enemiesPositions.objects.forEach(enemyData => {
            let newEnemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.name);

            if(enemyData.name === 'flyingRobot') {
                this.flyingEnemies.add(newEnemy);
            } else {
                this.landEnemies.add(newEnemy);
            }
            
        });

        this.physics.add.overlap(this.player.shield, this.landEnemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player.sprite, this.landEnemies, this.handleBodyCollision, null, this);
        this.physics.add.overlap(this.bullets, this.landEnemies, this.handleBulletCollision, null, this);
        this.physics.add.collider(this.greenTilesLayer, this.landEnemies, null, null, this);

        this.physics.add.overlap(this.player.shield, this.flyingEnemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player.sprite, this.flyingEnemies, this.handleBodyCollision, null, this);
        this.physics.add.overlap(this.bullets, this.flyingEnemies, this.handleBulletCollision, null, this);
        this.physics.add.collider(this.greenTilesLayer, this.flyingEnemies, null, null, this);
    }

    handleBodyCollision(player, enemy) {
        // Verifica si el jugador está en una animación de lucha
        const currentAnim = player.anims.currentAnim.key;
        if (currentAnim === 'punch' || currentAnim === 'kick' || currentAnim === 'shield') {
            this.hitEnemy(null, enemy);
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
        this.hitEnemy(null, enemy);
        bullet.destroy();
    }

    playMusic() {
        let music = this.sound.add('bitest');
        // music.on('play', listener);
        music.play();
        music.setLoop(true);

    }

    addBackground() {

        let width = this.game.config.width;
        let health = this.game.config.health;

        this.bg1 = this.add.tileSprite(0, 0, width, health, 'bg1')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg2 = this.add.tileSprite(0, 0, width, health, 'bg2')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg3 = this.add.tileSprite(0, 0, width, health, 'bg3')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg4 = this.add.tileSprite(0, 0, width, health, 'bg4')
            .setScrollFactor(0)
            .setOrigin(0, 0);
        this.bg5 = this.add.tileSprite(0, 0, width, health, 'bg5')
            .setScrollFactor(0)
            .setOrigin(0, 0);
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
            // .startFollow(this.player.sprite, true, 0.5, 0, 200, 0)
            .startFollow(this.player.sprite, true, 1, 0.1, 0, 0)
            // .setZoom(1.5)
            // .zoomTo(this.player.sprite, 1000)
            // .centerOn(0,this.map.heightInPixels)
            // .setSize(800, 600)
            .setFollowOffset(0, -50);

    }

    addTileMaps() {
        this.map = this.make.tilemap({ key: 'tilemapJson' });

        const tiles = this.map.addTilesetImage('Tileset', 'tilemapImage');
        this.groundLayer = this.map.createLayer('ground', tiles);

        const greenTiles = this.map.addTilesetImage('greenTiles2', 'tilemapImage2');
        this.greenTilesLayer = this.map.createLayer('greenPlatforms', greenTiles);

        // const collisionLayer = this.greenTilesLayer.setCollisionFromCollisionGroup();
        // this-this.greenTilesLayer.setCollisionByExclusion([-1]);
        // this.matter.world.convertTilemapLayer(this.greenTilesLayer);
        // this.greenTilesLayer.renderDebug(this.add.graphics());

        const objectTiles = this.map.addTilesetImage('objects', 'objectsTilemap');
        const treesLayer = this.map.createLayer('trees', objectTiles);


        // this.greenTilesLayer.setCollisionByProperty({ collider: true });
        this.groundLayer.setCollisionByProperty({ collider: true });
        this.physics.add.collider(this.player.sprite, this.groundLayer);

        this.greenTilesLayer
            .setDepth(0)
            .setCollisionByProperty({ collider: true });
        this.physics.add.collider(this.player.sprite,  this.greenTilesLayer);
        // this.physics.add.collider(this.player.sprite, collisionBoxes);
    }


}
