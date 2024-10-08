import { Bullet } from '../objects/Bullet.js';
import { animationConfig } from '../config/playerAnimations.js';

export class Player extends Phaser.Physics.Arcade.Sprite {

    state = 'idle';
    isMoving = false;
    isJumping = false;
    isJumpingDown = false;
    blockedJump = false;
    blockedJumpDown = false;
    velocity = 100;
    specialEnabled = true;
    ammoEnabled = true;

    shield;
    shieldThrown = false;
    shieldCached = true;

    actionsDamage = {
        punch: 25,
        kick: 35,
        shield: 50,
        whip: 100,
        specialExplosion: 150,
    };

    health = 100;
    power = 100;
    vulnerable = true;

    movingDirection = 'right';
    focusTo = 'right';
    blockedMovement = false;

    bulletFired = false;
    bullets;

    fightEnds = true;
    blockedFight = false;

    originalWidth = 26;
    originalHeight = 52;

    sounds = [];

    constructor(scene, x, y, texture) {

        super(scene, x, y, texture);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this
            .setDepth(5)
            .setBounce(0.1)
            .setCollideWorldBounds(true)
            .setScale(0.6)
            .setSize(this.originalWidth, this.originalHeight)
            .setOffset(24, 6)
            .setMaxVelocity(100, 400);

        this.addSounds();
        this.setFightAnimationState();
        this.anims.play('idle', true);


        this.originalX = this.x;
        this.originalY = this.y;


        this.bullets = this.scene.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            allowGravity: false,
        });

    }

    static createAnimations(scene) {
        
        animationConfig.forEach( animation => {

            let { texture, frames } = animation;
            scene.anims.create({
                ...animation,
                frames: scene.anims.generateFrameNumbers(texture, frames),
            });

        });

        scene.anims.createFromAseprite('shot');

    }

    setFightAnimationState() {
        let fightAnimations = [
            'punch',
            'punch2',
            'kick',
            'shield',
            'fly',
            'catch',
            'burst',
            'jumpKick',
            'whip',
            'special',
        ];

        this.on('animationcomplete', (anim, frame) => {

            if (fightAnimations.includes(anim.key)) {
                this.fightEnds = true;
                this.vulnerable = true;
                this.blockedMovement = false;
                this.state = 'idle';
                this.idle();

            }
        });
    }

    resetSprite() {
        let offsetX = this.focusTo === 'right' ? 24 : 15;

        this.setVelocityX(0);
        this.setSize(this.originalWidth, this.originalHeight);
        this.setPosition(this.originalX, this.y);
        this.setOffset(offsetX, 7);
        this.setScale(0.6);

        this.scene.cameras.main.startFollow(this, true, 1, 0.1, 0, 0)

    }

    idle() {

        this.setVelocityX(0);
        if (
            this.state !== 'throw' &&
            this.state !== 'jump' &&
            this.state !== 'jumpKick' &&
            this.state !== 'kick' &&
            this.state !== 'shield' &&
            this.state !== 'catch' &&
            this.state !== 'whip' &&
            this.state !== 'special' &&
            this.state !== 'landing' &&
            this.state !== 'punch' &&
            this.state !== 'burst'
        ) {
            this.anims.play('idle', true);
            this.state = 'idle';
        }
    }

    move(direction) {
        if (!this.blockedMovement && this.fightEnds) {

            this.originalX = this.x;
            this.originalY = this.y;
            this.movingDirection = direction;
            this.focusTo = direction;
            let xMovement = direction === 'left' ? -1 : 1;
            let flip = direction === 'left';
            let offsetX = this.focusTo === 'right' ? 24 : 15;

            this.setVelocityX(this.velocity * xMovement);
            this.setOffset(offsetX, 6);

            if (
                this.state !== 'jump' &&
                this.state !== 'runningJump' &&
                this.state !== 'landing'
            ) {
                this.anims.play('run', true).setFlipX(flip);
                this.state = 'running';
            }
        }
    }

    takeDamage(amount) {
        this.startBlink(3);
        this.sounds['hurt'].setVolume(0.5).play();
        this.health -= amount;
    }

    throwShield() {

        if (this.state !== 'throw') {

            this.shield = this.scene.physics.add.sprite(this.x, this.y, 'shield-fly');
            this.shield.setVisible(false);
            this.shield.setScale(0.6);
            this.shield.setDepth(5);
            this.bullets.add(this.shield);
            let distance = 150;
            this.blockedMovement = true;
            this.anims.play('throw', true);
            this.state = 'throw';

            this.scene.time.delayedCall(400, () => {
                this.sounds['boomerang'].play();
            });

            this.scene.time.delayedCall(375, () => {

                if (this.shield) {

                    let shieldPosition = {
                        x: this.focusTo == 'right'
                            ? this.x + (this.width / 2)
                            : this.x - (this.width / 2),
                        y: this.y
                    };
                    this.shield.setPosition(shieldPosition.x, shieldPosition.y);
                    this.shield.setVisible(true);

                    this.shield.anims.play('fly', true);

                    let shieldTarget = this.focusTo == 'right'
                        ? shieldPosition.x + distance
                        : shieldPosition.x - distance;

                    this.scene.tweens.add({
                        targets: this.shield,
                        x: shieldTarget,
                        y: shieldPosition.y,
                        duration: 333,
                        ease: 'Power1',
                        onComplete: () => {
                            this.flyBackTween();
                        }
                    });
                }

            });
        }

    }

    flyBackTween() {
        this.scene.tweens.add({
            targets: this.shield,
            x: this.x,
            y: this.y,
            duration: 333,
            ease: 'Power1',
            onComplete: () => {
                this.shield.setVisible(false);
                this.shieldThrown = false;
                this.shieldCached = true;
                this.shield.destroy();
                this.anims.play('catch', true);
            }
        });

        this.on('animationcomplete-catch', (anim, frame) => {
            this.state = 'idle';
            this.idle();
            this.fightEnds = true;
            this.blockedMovement = false;
        });

    }

    fireBullet(scene) {

        let playerBodyoffest = this.focusTo == 'right'
            ? this.width * 0.5
            : this.width * -0.5;

        let bulletOrigin = scene.player.x + playerBodyoffest;
        let bullet = this.bullets.get(bulletOrigin, scene.player.y);
        if (bullet) {
            bullet.fire(bulletOrigin, scene.player.y, this.focusTo);
            this.sounds['player-fire'].play();

        } else {
            console.log('No hay balas disponibles');
        }
    }

    burst() {
        if (this.ammoEnabled) {

            this.resetSprite();
            this.state = 'burst';
            this.blockedFight = true;
            this.fightEnds = false;

            this.setVelocityX(0);
            this.blockedMovement = true;
            this.anims.play('burst', true);

            this.on('animationcomplete-burst', (anim, frame) => {
                this.resetSprite();
                this.state = 'idle';
                this.idle();
                this.fightEnds = true;
                this.blockedMovement = false;
                this.ammoEnabled = false;
                this.scene.uiContainer.disableAmmoMarker();
            });
        } else {
            this.sounds['error'].play();
            this.scene.uiContainer.uiBlink('ammoMarker', 2, true);

        }
    }

    kick() {
        if (this.state !== 'whip') {

            this.blockedFight = true;
            this.fightEnds = false;
            this.anims.play('kick', true);
            this.state = 'kick';
            this.sounds['pre-punch'].play();
            this.on('animationcomplete-kick', (anim, frame) => {
                this.state = 'idle';
                this.idle();
                this.fightEnds = true;
            });
        }
    }

    punch() {
        if (this.state !== 'whip') {
            this.resetSprite();
            this.blockedFight = true;
            this.fightEnds = false;
            this.anims.play('punch');
            this.state = 'punch';
            this.sounds['pre-punch'].play();
            this.on('animationcomplete-punch', (anim, frame) => {
                this.state = 'idle';
                this.idle();
                this.fightEnds = true;
            });
        }
    }

    punch2() {
        if (this.state !== 'whip') {

            this.resetSprite();
            this.blockedFight = true;
            this.fightEnds = false;
            this.anims.play('punch2', true);
            this.state = 'punch2';
            this.sounds['pre-punch'].play();
            this.on('animationcomplete-punch2', (anim, frame) => {
                this.state = 'idle';
                this.idle();
                this.fightEnds = true;
            });
        }
    }

    whip() {
        if (!this.isJumping) {
            let offsetX = this.focusTo === 'right' ? 24 : 90;
            let compensation = this.focusTo === 'right' ? 1 : -1;

            this.blockedFight = true;
            this.fightEnds = false;
            this.vulnerable = false;
            this.blockedMovement = true;

            this.scene.cameras.main.stopFollow();

            this.setVelocityX(0);
            this.anims.play('whip', true);
            this.setPosition(this.originalX + (22 * compensation), this.y - 1);
            this.setOffset(offsetX, 10);
            this.setScale(0.58);


            this.scene.time.delayedCall(600, () => {

                if (this.anims.currentAnim.key === 'whip' && this.anims.isPlaying) {
                    this.sounds['whip'].play();

                    this.state = 'whip';
                }

            });

            this.scene.time.delayedCall(740, () => {
                if (this.state === 'whip') {
                    this.setSize(135, 64);
                    this.power -= 25;
                    this.scene.uiContainer.powerbarUpdate();
                }
            });

            this.on('animationcomplete-whip', (anim, frame) => {

                this.resetSprite();
                this.blockedMovement = false;
            });
        }
    }

    shieldAttack() {
        this.setVelocityX(0);
        this.blockedFight = true;
        this.fightEnds = false;

        if (this.shieldCached && !this.shieldThrown) {
            this.shieldThrown = true;
            this.throwShield();
        }
    }

    shieldHit() {
        this.resetSprite();
        if (
            this.movingDirection !== 'up' &&
            this.movingDirection !== 'down' &&
            this.state !== 'throw'
        ) {
            this.blockedFight = true;
            this.fightEnds = false;
            this.anims.play('shield', true);
            this.state = 'shield';
            this.scene.time.delayedCall(100, () => {
                if (this.state === 'shield') {
                    this.sounds['pre-punch'].play();
                }
            });
        }
    }

    handleJump() {
        if (!this.blockedJump) {
            if (this.state === 'whip' || this.state === 'throw') {
                this.resetSprite();
            }
            this.isJumping = true;
            this.blockedJump = true;
            this.blockedMovement = false;
            this.fightEnds = true;
            this.movingDirection = 'up';
            this.setVelocityY(-400);
            this.setGravityY(400);
            this.anims.play('jump');
            this.sounds['jump'].play();

            if (this.state === 'running') {
                this.state = 'runningJump';
            } else {
                this.state = 'jump';
            }

            this.on('animationcomplete-jump', (anim, frame) => {
                this.state = 'idle';
                this.idle();
                this.isJumping = false;
            });
        }


    }

    jumpKick() {
        this.fightEnds = false;
        this.blockedFight = true;
        this.anims.play('jumpKick', true);
        this.sounds['pre-punch'].play();
        this.state = 'jumpKick';
        this.on('animationcomplete-jumpKick', (anim, frame) => {
            this.state = 'idle';
            this.idle();
            this.fightEnds = true;
        });
    }

    special() {
        if (!this.isJumping
            && this.specialEnabled
        ) {

            this.fightEnds = false;
            this.anims.stop();
            this.state = 'special';
            this.specialEnabled = false;
            this.scene.uiContainer.disableSpecialMarker();
            this.scene.cameras.main.stopFollow();
            this.vulnerable = false;
            let originalX = this.x;
            let originalY = this.y;
            let width = this.width;
            let height = this.height;
            let directionX = this.focusTo === 'left' ? -1 : 1;
            let flip = this.focusTo === 'left';

            this.sounds['special'].play();
            this.setVelocityX(0);
            this.setVisible(false);

            let special = this.scene.physics.add.sprite(originalX + 3, (originalY - height / 2) + 3, 'special');

            special.setSize(this.originalWidth, this.originalHeight);
            special.setDepth(5);
            special.setFlipX(flip);
            special.anims.play('special', true);
            this.scene.tweens.add({
                targets: special,
                x: originalX + 50 * directionX,
                y: originalY - 80,
                duration: 2055.55,
                ease: 'Power1',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: special,
                        x: originalX + 50 * directionX,
                        y: originalY - 27,
                        duration: 55.55,
                        ease: 'Power1',
                    });
                }
            });

            special.body.setAllowGravity(false);
            special.setScale(0.95);

            this.scene.time.delayedCall(2110, () => {

                if (this.state === 'special') {
                    special.setSize(special.width, special.height);
                    this.state = 'specialExplosion';
                    this.sounds['explosion'].play();
                    this.body.setSize(128, 64);
                    this.scene.cameras.main.shake(100, 0.05);
                }

            });

            special.on('animationcomplete-special', () => {
                this.resetSprite();
                this.setVisible(true);
                this.state = 'idle';
                this.idle();
                this.vulnerable = true;
                this.fightEnds = true;
                this.blockedMovement = false;
                special.destroy();
                this.setPosition(originalX + 50 * directionX, originalY + 10);
                this.originalX = this.x;
                this.originalY = this.y;
            })

        }

    }

    land() {
        this.isJumping = false;
        this.anims.play({ key: 'land', frameRate: 15 }, true);
        this.sounds['land'].play();
        this.state = 'landing';
        this.isJumpingDown = false;
        this.on('animationcomplete-land', (anim, frame) => {
            this.state = 'idle';
            this.idle();
            this.movingDirection = this.focusTo;
            this.blockedMovement = false;


        });
    }

    runCombo(name) {

        switch (name) {
            case 'combo1':
                this.punch2();
                break;
            case 'combo2':
                this.burst();
                break;
            case 'combo3':
                this.kick();
                break;

        }
    }

    addSounds() {
        let playerSounds = [
            'pre-punch',
            'player-punch',
            'player-fire',
            'jump',
            'land',
            'hurt',
            'shield',
            'boomerang',
            'whip',
            'hit',
            'special',
            'explosion',
            'chest',
            'item',
            'increase',
            'error',
        ];

        playerSounds.forEach(sound => {
            this.sounds[sound] = this.scene.sound.add(sound);
        });

    }

    startBlink(repeatCount) {

        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            ease: 'Linear',
            duration: 200,
            yoyo: true,
            repeat: repeatCount - 1,
            onComplete: () => {
                this.setAlpha(1);
            }
        });
    }
}
