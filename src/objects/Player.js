import { Scene } from 'phaser';
import { Bullet } from '../objects/Bullet.js';

export class Player extends Phaser.Physics.Arcade.Sprite {

    state = 'idle';
    isJumping = false;
    blockedJump = false;
    velocity = 100;
    specialEnabled = true;

    shield;
    shieldThrown = false;
    shieldCached = true;

    health = 100;
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

    constructor(scene, x, y, texture) {

        super(scene, x, y, texture);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this
            .setDepth(2)
            .setBounce(0.2)
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
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('captain-idle', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });

        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('captain-run', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });

        scene.anims.create({
            key: 'punch',
            frames: scene.anims.generateFrameNumbers('captain-fight', { start: 1, end: 3 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'kick',
            frames: scene.anims.generateFrameNumbers('captain-fight', { start: 4, end: 7 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'shield',
            frames: scene.anims.generateFrameNumbers('captain-fight', { start: 8, end: 11 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'throw',
            frames: scene.anims.generateFrameNumbers('shield-throw', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'catch',
            frames: scene.anims.generateFrameNumbers('shield-throw', { start: 12, end: 15 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'fly',
            frames: scene.anims.generateFrameNumbers('shield-fly', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'whip',
            frames: scene.anims.generateFrameNumbers('whip', { start: 0, end: 19 }),
            frameRate: 15,
            repeat: 0
        });

        scene.anims.create({
            key: 'special',
            frames: scene.anims.generateFrameNumbers('special', { start: 11, end: 56 }),
            frameRate: 18,
            repeat: 0
        });

        scene.anims.create({
            key: 'block',
            frames: scene.anims.generateFrameNumbers('special', { start: 0, end: 10 }),
            frameRate: 12,
            repeat: 0
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
                // console.log(`anim: ${anim.key} finish`, {
                //     state: this.state,
                //     isJumping: this.isJumping,
                //     blockedJump: this.blockedJump,
                //     shieldThrown: this.shieldThrown,
                //     shieldCached: this.shieldCached,
                //     vulnerable: this.vulnerable,
                //     movingDirection: this.movingDirection,
                //     focusTo: this.focusTo,
                //     blockedMovement: this.blockedMovement,
                //     fightEnds: this.fightEnds,
                //     blockedFight: this.blockedFight,
                // });
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
        if (!this.blockedMovement) {

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
        this.health -= amount;
    }

    throwShield() {
        this.shield = this.scene.physics.add.sprite(this.x, this.y, 'shield-fly');
        // this.shield.body.setAllowGravity(false);
        this.shield.setScale(0.6);
        this.bullets.add(this.shield);
        let distance = 150;
        this.blockedMovement = true;
        this.anims.play('throw', true);
        this.state = 'throw';

        this.scene.time.delayedCall(400, () => {
            // if (this.state === 'throw') {
            this.boomerangSound.play();
            // }
        });

        this.scene.time.delayedCall(375, () => {

            // if (this.state === 'throw') {

            let shieldPosition = {
                x: this.focusTo == 'right'
                    ? this.x + (this.width / 2)
                    : this.x - (this.width / 2),
                y: this.y
            };
            this.shield.setPosition(shieldPosition.x, shieldPosition.y);

            // this.shield.setVisible(true);
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
            // }

        });

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
            this.laserSound.play();

        } else {
            console.log('No hay balas disponibles');
        }
    }

    burst() {
        this.resetSprite();

        this.setVelocityX(0);
        this.blockedMovement = true;
        this.blockedFight = true;
        this.fightEnds = false;
        this.anims.play('burst', true);
        this.state = 'burst';

        this.on('animationcomplete-burst', (anim, frame) => {
            this.resetSprite();
            this.state = 'idle';
            this.fightEnds = true;
            this.blockedMovement = false;
        });
    }

    kick() {
        if (this.state !== 'whip') {

            this.blockedFight = true;
            this.fightEnds = false;
            this.anims.play('kick', true);
            this.state = 'kick';
            this.punchSound.play();
            this.on('animationcomplete-kick', (anim, frame) => {
                this.state = 'idle';
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
            this.punchSound.play();
            this.on('animationcomplete-punch', (anim, frame) => {
                this.state = 'idle';
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
            this.punchSound.play();
            this.on('animationcomplete-punch2', (anim, frame) => {
                this.state = 'idle';
                this.fightEnds = true;
            });
        }
    }

    whip() {
        // console.log('whip called');
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

                    this.specialSound.play();
                    this.state = 'whip';
                }

            });

            this.scene.time.delayedCall(740, () => {
                if (this.state === 'whip') {
                    this.punchSound.play();
                    this.setSize(135, 64);
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
                    this.punchSound.play();
                }
            });
        }
    }

    handleJump() {
        // console.log('before jump state', this);
        if (!this.blockedJump) {
            // this.anims.pause();
            this.resetSprite();
            this.isJumping = true;
            this.blockedJump = true;
            this.blockedMovement = false;
            this.fightEnds = true;
            this.movingDirection = 'up';
            this.setVelocityY(-400);
            this.setGravityY(400);
            this.anims.play('jump');

            if (this.state === 'running') {
                this.state = 'runningJump';
            } else {
                this.state = 'jump';
            }

            this.on('animationcomplete-jump', (anim, frame) => {
                // this.anims.play('idle');
                this.state = 'idle';
                this.isJumping = false;
            });
        }


    }

    jumpKick() {
        this.fightEnds = false;
        this.blockedFight = true;
        this.anims.play('jumpKick', true);
        this.state = 'jumpKick';
        this.on('animationcomplete-jumpKick', (anim, frame) => {
            this.state = 'idle';
            this.fightEnds = true;
        });
    }

    special() {
        if (!this.isJumping
            //  && this.specialEnabled
        ) {

            this.fightEnds = false;
            this.anims.stop();
            this.state = 'special';
            this.specialEnabled = false;
            this.scene.cameras.main.stopFollow();
            this.vulnerable = false;
            let originalX = this.x;
            let originalY = this.y;
            let width = this.width;
            let height = this.height;
            let directionX = this.focusTo === 'left' ? -1 : 1;
            let flip = this.focusTo === 'left';

            this.specialSound.play();
            this.setVelocityX(0);
            this.setVisible(false);

            let special = this.scene.physics.add.sprite(originalX + 3, (originalY - height / 2) + 3, 'special');
            // special.setOffset(special.width - this.originalWidth, special.height - this.originalHeight);

            // console.log('special', special.width , special.height);
            special.setSize(this.originalWidth, this.originalHeight);

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
                        duration: 200,
                        ease: 'Power1',
                    });
                }
            });

            special.body.setAllowGravity(false);
            special.setScale(0.95);

            this.scene.time.delayedCall(2300, () => {

                if (this.state === 'special') {
                    console.log('this', this);
                    special.setSize(special.width, special.height);
                    this.state = 'specialExplosion';
                    this.explosionSound.play();
                    this.body.setSize(128, 64);
                    this.scene.cameras.main.shake(100, 0.05);
                }

            });

            special.on('animationcomplete-special', () => {
                this.resetSprite();
                this.setVisible(true);
                this.state = 'idle';
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
        this.anims.play('land', true);
        this.state = 'landing';
        this.on('animationcomplete-land', (anim, frame) => {
            this.state = 'idle';
            this.movingDirection = this.focusTo;
            this.blockedMovement = false;
        });
    }

    runCombo(name) {
        // console.log('run combo',name);

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
        this.punchSound = this.scene.sound.add('punch');
        this.laserSound = this.scene.sound.add('laser');
        this.specialSound = this.scene.sound.add('special');
        this.explosionSound = this.scene.sound.add('explosion');
        this.boomerangSound = this.scene.sound.add('boomerang');
        this.laserSound.setVolume(0.4);


    }

    startBlink(repeatCount) {
        // Crear un tween para parpadear
        // Asegurarse de que el sprite vuelva a ser completamente visible
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            ease: 'Linear',
            duration: 200, // Duración de cada parpadeo (mitad para desvanecer y mitad para reaparecer)
            yoyo: true, // Hacer el parpadeo (yoyo vuelve a la opacidad original)
            repeat: repeatCount - 1, // Repetir varias veces el parpadeo
            onComplete: () => {
                this.setAlpha(1);
            }
        });
    }
}
