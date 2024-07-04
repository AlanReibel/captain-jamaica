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

    create() {
        this.addBackground();

        this.gameOver = false;
        this.player = new Player(this, 100, 400, 'captain-idle');
        this.inputHandler = new InputHandler(this);

        // this.showGuideText();


        console.log('game scene', this);



        this.playMusic();


        this.addTileMaps();
        this.createCamera();
        this.addHealthBar();

        this.createEnemies();


    }

    update() {
        // reset fight
        if (this.player.body.velocity.x == 0 && this.player.body.blocked.down) {
            this.player.movingDirection = 'none';
        }

        if (this.player.state === 'jump' && this.player.body.velocity.y >= 0) {

            this.player.movingDirection = 'down';

            if (
                this.inputHandler.isFightActionPressed() &&
                !this.player.blockedFight
            ) {
                this.player.jumpKick();
            }

        }

        if(this.player.state === 'jump' && this.player.body.blocked.down) {
                this.player.land();
        }

        if (this.inputHandler.isFightActionLeaved()) {
            this.player.blockedFight = false;
        }
        
        if (this.inputHandler.isJumpLeaved()) {
            this.player.blockedJump = false;
        }
        // fighting
        if (this.inputHandler.isFightActionPressed() && !this.player.blockedFight) {
            this.handleFightActions();
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
            this.scene.start('GameOver');
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

    }

    handleFightActions() {
        // pressed Q key or A button
        if (
            this.inputHandler.qKey.isDown ||
            this.inputHandler.buttons['A']
        ) {

            this.player.burst();
        }
        // pressed E key or B button
        else if (
            this.inputHandler.eKey.isDown ||
            this.inputHandler.buttons['B']
        ) {

            this.player.kick();
        }
        // pressed F key or Y button
        else if (
            this.inputHandler.fKey.isDown ||
            this.inputHandler.buttons['Y']
        ) {
            this.player.shieldAttack();

        }
        // pressed space key or X button
        else if (
            this.inputHandler.cursors.space.isDown ||
            this.inputHandler.buttons['X']
        ) {
            this.player.shieldHit();
        }
    }

    hitEnemy(enemy) {
        let dieSound = this.sound.add('die');
        // dieSound.setVolume(0.4);
        enemy.hurt();
        dieSound.play();
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
        enemiesPositions.objects.forEach(enemyData => {
            let newEnemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.name);

            if(enemyData.name === 'flyingRobot') {
                this.flyingEnemies.add(newEnemy);
            } else {
                this.landEnemies.add(newEnemy);
                this.physics.add.overlap(newEnemy.bullets, this.player, this.playerFired, null, this);
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
    }

    playerFired( player, bullet) {
        // console.log('player',player);
        if(this.player.vulnerable) {
            this.player.vulnerable = false;
            this.player.takeDamage(bullet.damage);
            this.healthbarUpdate();
            bullet.destroy();
        }

        this.time.delayedCall( 800, () => {
            this.player.vulnerable = true;
        });
    }

    handleBulletCollision(bullet, enemy) {

        this.hitEnemy(enemy);

        if(bullet.texture.key === 'bullet') {
            bullet.destroy();
        }

    }

    handleHitCollision( shield, enemy) {
        this.hitEnemy(enemy);
    }

    handleBodyCollision(player, enemy) {
        // Verifica si el jugador está en una animación de lucha
        const playerAnim = player.anims.currentAnim.key;
        if (playerAnim === 'punch' || playerAnim === 'kick' || playerAnim === 'shield') {
            this.hitEnemy(enemy);
            console.log('enemy hit');
        }

        if (enemy.state === 'attacking' && this.player.vulnerable) {
            this.player.takeDamage(10);
            this.player.vulnerable = false;
            this.healthbarUpdate();
            this.time.delayedCall( 800, () => {
                this.player.vulnerable = true;
            });
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
        this.physics.add.collider(this.player, this.groundLayer);

        this.greenTilesLayer
            .setDepth(0)
            .setCollisionByProperty({ collider: true });
        this.physics.add.collider(this.player,  this.greenTilesLayer);
        // this.physics.add.collider(this.player, collisionBoxes);
    }

    addHealthBar() {
        this.uiContainer = this.add.container(0, 0);
        this.uiContainer.setScrollFactor(0);

        let health = this.player.health;
        let healthbarBackground = this.add.graphics();
        healthbarBackground
            .fillStyle( 0xff0000, 1)
            .fillRect(10, 10, health, 15);
        // Crear un gráfico para la barra de vida
        this.healthBar = this.add.graphics();
        this.healthBar
            .fillStyle(0x00ff00, 1)
            .fillRect(10, 10, health, 15);

        this.uiContainer.add(healthbarBackground);
        this.uiContainer.add(this.healthBar);

    }

    healthbarUpdate() {
        console.log('health',this.player.health);
        this.healthBar.clear();
        this.healthBar
            .fillStyle(0x00ff00, 1)
            .fillRect(10, 10, this.player.health, 15);

        if(this.player.health === 0) {
            this.gameOver = true;
        }
    }


}
