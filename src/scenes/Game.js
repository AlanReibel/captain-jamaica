import { Scene } from 'phaser';
import { Player } from '../objects/Player.js';
import { InputHandler } from '../objects/InputHandler.js';
import { Enemy } from '../objects/Enemy.js';
import { Animal } from '../objects/Animal.js';
import { Box } from '../objects/Box.js';

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
    map;

    enemies;
    groundLayer;
    healthBar;
    guideIsOpen = false;

    boxesEnabled = {};

    create() {
        this.cameras.main.fadeIn(200, 0, 0, 0);

        this.player = new Player(this, 100, 400, 'captain-idle');
        this.inputHandler = new InputHandler(this);

        this.addBackground();
        this.playMusic();
        this.addTileMaps();
        this.createCamera();
        this.createEnemies();
        this.createAnimals();
        this.enableDomGuide();
        this.eventListeners();

        console.log('game scene', this);


    }

    update(time, delta) {

        // console.log('time',time);
        // console.log('delta',delta);
        // console.log('fps', this.game.loop.actualFps);

        // Incrementar el contador de cuadros
        this.frameCount = (this.frameCount || 0) + 1;
        let checkingRate = this.game.loop.actualFps < 50 ? 4 : 1;

        // every 6fps 
        if (this.frameCount % checkingRate === 0) {

            if (this.player.body.velocity.y > 200 && this.player.isJumpingDown) {
                this.player.isJumpingDown = false;

            }
            
            if (this.player.body.velocity.y <= -20) {
                this.player.movingDirection = 'down';

            } else if (this.player.body.velocity.x === 0 && this.player.body.blocked.down) {
                this.player.movingDirection = 'none';
            }

            if (this.player.movingDirection === 'down' && this.player.body.blocked.down && this.player.fightEnds) {
                this.player.land();
                this.player.movingDirection = 'none';
            }

            this.handleBurstAnimation();

            if (this.landEnemies) {
                this.updateChars(this.landEnemies);
            }

            if (this.flyingEnemies) {
                this.updateChars(this.flyingEnemies);
            }

            if (this.flyingAnimals) {
                this.updateChars(this.flyingAnimals);
            }

            if (this.landAnimals) {
                this.updateChars(this.landAnimals);
            }

            // Finalizar juego
            if (this.player.x > 3150 && this.player.y < 70) {
                this.finishGame();
            }

            // holding keys
            if (this.inputHandler.canBeHold) {
                this.inputHandler.holdingCheck()
            }
        }

        // if movement event was emmitet before and not cancelled (still pressing)
        if (this.player.isMoving) {
            this.handleMovement();
        }
        // console.log('player state', this.player.state);



    }

    eventListeners() {

        this.inputHandler.emitter.on('fightActionPressed', this.handleFightActions, this);
        this.inputHandler.emitter.on('jumpKeyPressed', this.handleJump, this);
        this.inputHandler.emitter.on('moveKeyPressed', this.handleMovement, this);
        this.inputHandler.emitter.on('jumpDownPressed', this.jumpDownPressed, this);

        this.inputHandler.emitter.on('fightActionLeaved', this.handleFightLeaved, this);
        this.inputHandler.emitter.on('jumpKeyLeaved', this.jumpLeaved, this);
        this.inputHandler.emitter.on('movingKeyUp', this.moveLeaved, this);
        this.inputHandler.emitter.on('jumpDownLeaved', this.jumpDownLeaved, this);

        this.inputHandler.emitter.on('holdAction', this.holdingAction, this);
    }

    jumpDownPressed() {
        console.log('jumpDownPressed');
        this.player.blockedJumpDown = false;
        this.player.isJumpingDown = true;
    }

    jumpDownLeaved() {
        this.player.blockedJumpDown = false;
    }

    enableDomGuide() {
        const guideButton = document.querySelector('#guideButton');

        guideButton.classList.add('visible');
        guideButton.addEventListener('pointerdown', () => {
            if (this.guideIsOpen) {
                this.scene.resume();
                this.guideIsOpen = false;
            } else {
                this.scene.pause();
                this.guideIsOpen = true;
            }
        });
    }

    holdingAction() {

        if (this.inputHandler.holding['X'] || this.inputHandler.holding['q']) {
            this.player.shieldAttack()
        }
        if (this.inputHandler.holding['Y'] || this.inputHandler.holding['e']) {
            this.player.special();
        }
        this.inputHandler.canBeHold = false;

    }

    endGame() {
        this.music.stop();
        this.scene.start('GameOver', { inputHandler: this.inputHandler });
    }

    updateChars(charGroup) {
        const characters = charGroup.getChildren();
        for (let i = 0; i < characters.length; i++) {
            const char = characters[i];
            if (this.isCharInCameraView(char, this.cameras.main.worldView)) {
                char.update();
            }
        }
    }

    handleJump() {


        if (this.player.body.blocked.down && !this.player.isJumpingDown) {
            this.player.handleJump();
        }
    }

    jumpLeaved() {
        this.player.blockedJump = false;
    }

    handleFightActions() {

        // console.log('fight event called');
        if (this.player.movingDirection === 'down') {
            this.player.jumpKick();
        } else if (
            // pressed Q key or X button
            this.inputHandler.qKey.isDown ||
            this.inputHandler.buttons['X']
        ) {
            this.player.shieldHit();

        } else if (
            // pressed space key or B button
            this.inputHandler.cursors.space.isDown ||
            this.inputHandler.buttons['B']
        ) {
            this.player.punch();

        } else if (
            // pressed E key or Y button
            this.inputHandler.eKey.isDown ||
            this.inputHandler.buttons['Y']
        ) {
            // this.player.special();
            if (this.player.power >= 25 && this.player.state !== 'burst') {
                this.player.whip();
            } else {
                this.powerBarBlick();
            }

        }

    }

    handleFightLeaved() {
        this.player.blockedFight = false;

    }

    handleBurstAnimation() {
        if (this.player.state === 'burst') {
            const currentFrame = this.player.anims.currentFrame;
            if (currentFrame.index >= 3 && currentFrame.index % 2 === 1) {
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
    }

    hitEnemy(enemy, damage) {

        enemy.hurt(damage);
    }

    handleMovement() {
        this.player.isMoving = true;
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
    }

    moveLeaved() {

        let stillMoving = this.inputHandler.aKey.isDown || this.inputHandler.dKey.isDown || this.inputHandler.cursors.left.isDown || this.inputHandler.cursors.right.isDown;
        if (!stillMoving) {

            this.player.isMoving = false;
            this.player.idle();
        }
    }

    createEnemies() {
        this.landEnemies = this.physics.add.group();

        this.flyingEnemies = this.physics.add.group({
            allowGravity: false,
        });

        let enemiesPositions = this.map.getObjectLayer('enemies');

        const enemySoundsList = [
            'enemy-die',
            'enemy-shot',
            'enemy-punch',
        ];
        let enemySounds = {};
        enemySoundsList.forEach(sound => {
            enemySounds[sound] = this.sound.add(sound);
        });

        enemiesPositions.objects.forEach(enemyData => {

            let newEnemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.name);
            newEnemy.sounds = enemySounds;

            this.physics.add.collider(this.walls, newEnemy);
            this.physics.add.overlap(this.player, newEnemy, this.handleBodyCollision, null, this);
            if (newEnemy.fly) {
                this.flyingEnemies.add(newEnemy);

            } else {
                this.landEnemies.add(newEnemy);
                this.physics.add.collider(this.greenTilesLayer, newEnemy);
            }

            if (newEnemy.shot) {
                this.physics.add.overlap(newEnemy.bullets, this.player, this.playerFired, null, this);
                this.physics.add.collider(newEnemy.bullets, this.greenTilesLayer, this.destroyBullet, null, this);
                this.physics.add.collider(newEnemy.bullets, this.walls, this.destroyBullet, null, this);
            }

        });

        this.physics.add.collider(this.landEnemies, this.landEnemies, null, null, this);

        this.physics.add.overlap(this.player.bullets, this.landEnemies, this.handleBulletCollision, null, this);
        this.physics.add.overlap(this.player.bullets, this.flyingEnemies, this.handleBulletCollision, null, this);
        this.physics.add.collider(this.player.bullets, this.greenTilesLayer, this.destroyBullet, null, this);
        this.physics.add.collider(this.player.bullets, this.walls, this.destroyBullet, null, this);

    }

    createAnimals() {
        this.landAnimals = this.physics.add.group();

        this.flyingAnimals = this.physics.add.group({
            allowGravity: false,
        });

        let animalsPositions = this.map.getObjectLayer('animals');

        animalsPositions.objects.forEach(animalData => {
            // console.log('animalData',animalData);
            let flip = false;


            animalData.properties?.forEach(property => {
                if (property.name === 'flip') {
                    flip = property.value;
                }
            });

            let newAnimal = new Animal(this, animalData.x, animalData.y, animalData.name, flip);

            if (newAnimal.fly) {
                this.flyingAnimals.add(newAnimal);

            } else {
                this.landAnimals.add(newAnimal);
                this.physics.add.collider(this.greenTilesLayer, newAnimal);
            }

        });

        this.physics.add.collider(this.flyingAnimals, this.walls);
        this.physics.add.collider(this.landAnimals, this.walls);


    }

    isCharInCameraView(char, visibleArea) {
        return (
            char.x + char.width > visibleArea.x &&
            char.x < visibleArea.x + visibleArea.width &&
            char.y + char.height > visibleArea.y &&
            char.y < visibleArea.y + visibleArea.height
        );
    }

    destroyBullet(bullet, map) {

        if (bullet.texture.key !== 'shield-fly') {
            bullet.destroy();
        }
        let bulletExplosion = this.physics.add.sprite(bullet.x, bullet.y, 'explosion1');
        bulletExplosion.setDepth(5);
        bulletExplosion.body.setAllowGravity(false);
        bulletExplosion.anims.play('explosion1');

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

            this.player.sounds['hit'].play();
        }

        this.time.delayedCall(1000, () => {
            this.player.vulnerable = true;
        });
    }

    handleBulletCollision(bullet, enemy) {
        let damage;
        if (bullet.texture.key !== 'shield-fly') {
            this.destroyBullet(bullet);
            damage = 25;
        } else {
            damage = 50;
        }
        this.hitEnemy(enemy, damage);


    }

    handleBodyCollision(player, enemy) {

        let currentState = this.player.state;
        
        switch (currentState) {
            case 'kick':
                this.player.sounds['hit'].play();
            case 'jumpKick':
                this.player.sounds['hit'].play();
            case 'punch':
                this.player.sounds['player-punch'].play();
                break;
            case 'throw':
                this.player.sounds['shield'].play();
                break;
            default:
                break;
        }

        let enemyOnFront = player.focusTo === 'right'
            ? player.x <= enemy.x
            : player.x >= enemy.x;


        if (Object.keys(this.player.actionsDamage).includes(currentState) && enemyOnFront) {

            this.hitEnemy(enemy, this.player.actionsDamage[currentState]);
        }


        if (enemy.state === 'attacking' && !enemy.attackDone && this.player.vulnerable) {
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

        this.addUiContainer(x, y, gamewidth);

    }

    moveBackground(direction) {

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
            .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
            .startFollow(this.player, true, 1, 0.1, 0, 0)
            .setFollowOffset(0, -50);
    }

    addTileMaps() {

        this.map = this.make.tilemap({ key: 'tilemapJson' });

        const greenTiles = this.map.addTilesetImage('greenTiles2', 'tilemapImage2');
        this.greenTilesLayer = this.map.createLayer('greenPlatforms', greenTiles);
        this.walls = this.map.createLayer('walls', greenTiles);
        this.walls
            .setDepth(1)
            .setCollisionByProperty({ collider: true });
        this.physics.add.collider(this.player, this.walls);

        const decoTiles = this.map.addTilesetImage('newObjectSet', 'objectsTilemap');
        const backObjectLayer = this.map.createLayer('background', decoTiles);
        const buildings = this.map.createLayer('buildings', decoTiles);
        const farBackObjectLayer = this.map.createLayer('farBackground', decoTiles);
        const frontObjectLayer = this.map.createLayer('foreground', decoTiles);

        farBackObjectLayer.setDepth(0);


        buildings.setDepth(2);
        backObjectLayer.setDepth(4);
        frontObjectLayer.setDepth(5);

        this.greenTilesLayer
            .setDepth(3)
            .setCollisionByProperty({ collider: true });


        this.physics.add.collider(this.player, this.greenTilesLayer, null, (player, platform) => {
            let playerGoesUp = player.body.velocity.y > 0;

            if (player.isJumpingDown && !player.blockedJumpDown) {
                return false;
            }

            if (playerGoesUp) {
                player.isJumpingDown = false;
                return true;
            } else {
                return false;
            }
        });

        let boxesGroup = this.physics.add.group();
        let boxesPosition = this.map.getObjectLayer('boxes');

        boxesPosition.objects.forEach(boxData => {
            this.boxesEnabled[boxData.id] = true;
            let potionName, flip;
            boxData.properties.forEach(property => {
                switch (property.name) {
                    case 'potion':
                        potionName = property.value;
                        break;
                    case 'flip':
                        flip = property.value;
                        break;

                }
            });
            // console.log('potionName', potionName);
            let box = new Box(this, boxData.x, boxData.y, 'chest', potionName, flip);
            box.id = boxData.id;
            boxesGroup.add(box);
            this.physics.add.overlap(this.player, box.potions, this.collectPotion, null, this);
        });

        boxesGroup.setDepth(5);
        this.physics.add.collider(this.greenTilesLayer, boxesGroup);
        this.physics.add.collider(this.walls, boxesGroup);
        this.physics.add.overlap(this.player, boxesGroup, this.boxInteraction, null, this);


    }

    boxInteraction(player, box) {
        if (!this.player.fightEnds && this.boxesEnabled[box.id]) {
            this.boxesEnabled[box.id] = false;
            box.openBox();
            this.player.sounds['chest'].play();
        }
    }

    collectPotion(player, potion) {

        if (!potion.collected) {

            potion.collected = true;
            potion.removeCollidesWith(this.player);
            this.time.delayedCall(200, () => {
                potion.body.setVelocityY(-200);
            });

            let updated = false;

            switch (potion.name) {
                case 'health':
                    if (this.player.health < 100) {
                        let newHealth = this.player.health + potion.amount <= 100
                            ? this.player.health + potion.amount
                            : 100;

                        this.player.health = newHealth;
                        this.healthbarUpdate();
                        updated = true;
                        this.uiBlink(this.healthBar);

                    }
                    break;
                case 'power':
                    if (this.player.power < 100) {
                        let newPower = this.player.power + potion.amount <= 100
                            ? this.player.power + potion.amount
                            : 100;

                        this.player.power = newPower;
                        this.powerbarUpdate();
                        updated = true;
                        this.uiBlink(this.powerBar);


                    }
                    break;
                case 'ammo':
                    if (!this.player.ammoEnabled) {
                        this.player.ammoEnabled = true;
                        this.enableAmmoMarker();
                        updated = true;
                        this.uiBlink(this.ammoMarker);

                    }
                    break;

            }

            if (updated) {
                this.player.sounds['item'].play();
            }

            this.time.delayedCall(500, () => {
                this.player.sounds['increase'].setVolume(0.3).play();
                potion.destroy();

            });
        }



    }

    addUiContainer(x, y, gamewidth) {
        this.uiContainer = this.add.container(x, y);
        this.uiContainer.setScrollFactor(0)
            .setDepth(6);

        this.addHealthBar();
        this.addPowerBar(gamewidth);
        this.addSpecialUI(gamewidth / 2);
        this.addAmmoUI(gamewidth / 2);
    }

    addHealthBar() {

        let health = this.player.health;
        let healthbarBackground = this.add.graphics();

        let x = 10;
        let y = 10;

        healthbarBackground
            .fillStyle(0x000000, 1)
            .setAlpha(0.3)
            .fillRect(x, y, health, 15);

        this.healthBar = this.add.graphics();
        this.healthBar
            .fillStyle(0x00c749, 1)
            .fillRect(x, y, health, 15);

        this.uiContainer.add(healthbarBackground);
        this.uiContainer.add(this.healthBar);

        let healthIcon = this.add.image(x + 2, y + 1, 'healthIcon')
            .setOrigin(0);
        this.uiContainer.add(healthIcon);

    }

    addPowerBar(width) {

        let power = this.player.power;
        this.powerbarBackground = this.add.graphics();

        let x = width - 10 - power;
        let y = 10;

        this.powerbarBackground
            .fillStyle(0x000000, 1)
            .setAlpha(0.3)
            .fillRect(x, y, power, 15);

        this.powerBar = this.add.graphics();
        this.powerBar
            .fillStyle(0xfbe900, 1)
            .fillRect(x, y, power, 15);

        this.powerBar.position = x;
        this.uiContainer.add(this.powerbarBackground);
        this.uiContainer.add(this.powerBar);

        let powerIcon = this.add.image(x + 2, y + 1, 'powerIcon')
            .setOrigin(0);
        this.uiContainer.add(powerIcon);

    }

    powerbarUpdate() {

        this.powerBar.clear();
        if (this.player.power > 0) {
            this.powerBar
                .fillStyle(0xfbe900, 1)
                .fillRect(this.powerBar.position, 10, this.player.power, 15);
        }

    }

    powerBarBlick(repeatCount = 3) {
        // console.log('powerBarBlick');

        this.player.sounds['error'].play();
        this.tweens.add({
            targets: this.powerbarBackground,
            alpha: 0,
            ease: 'Linear',
            duration: 200,
            yoyo: true,
            repeat: repeatCount - 1,
            onComplete: () => {
                this.powerbarBackground.setAlpha(1);
            }
        });
    }

    uiBlink(target, repeatCount = 3, disabled = false) {
        this.tweens.add({
            targets: target,
            alpha: 0,
            ease: 'Linear',
            duration: 200,
            yoyo: true,
            repeat: repeatCount - 1,
            onComplete: () => {
                if (disabled) {
                    target.setAlpha(0.5);
                } else {
                    target.setAlpha(1);
                }
            }
        });
    }

    healthbarUpdate() {
        this.healthBar.clear();
        this.healthBar
            .fillStyle(0x00c749, 1)
            .fillRect(10, 10, this.player.health, 15);

        if (this.player.health <= 0) {
            // this.gameOver = true;
            this.endGame();
        }
    }

    addSpecialUI(midle) {
        let x = midle - 20;
        this.specialMarker = this.add.image(x, 20, 'specialMarker');
        this.specialMarker.setScale(0.4);
        this.specialMarker.setOrigin(0.5);

        this.uiContainer.add(this.specialMarker);
    }

    addAmmoUI(midle) {
        let x = midle + 20;
        this.ammoMarker = this.add.image(x, 20, 'ammo');
        this.ammoMarker.setOrigin(0.5);
        this.uiContainer.add(this.ammoMarker);
    }

    disableSpecialMarker() {
        this.specialMarker.setAlpha(0.5);
    }

    enableAmmoMarker() {
        this.ammoMarker.setAlpha(1);
    }

    disableAmmoMarker() {
        this.ammoMarker.setAlpha(0.5);
    }

    finishGame() {
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.scene.start('Finish', { inputHandler: this.inputHandler });
    }

}
