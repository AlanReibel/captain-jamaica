import { Scene } from 'phaser';
import { Bullet } from '../objects/Bullet.js';

export class Player extends Phaser.Physics.Arcade.Sprite {

    state = 'idle';
    blockedJump = false;
    velocity = 100;

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

    constructor(scene, x, y, texture) {

        super(scene, x, y, texture);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this
            .setDepth(1)
            .setBounce(0.2)
            .setCollideWorldBounds(true)
            .setScale(0.6);
        // console.log('player', this.sprite);
        this.createAnimations();
        this.anims.play('idle', true);
        this.punchSound = this.scene.sound.add('punch');

        // this.shield.setSize(100, 100)
        // scene.physics.world.enable(this.shield);
        // this.shield.setVisible(false);

        this.laserSound = scene.sound.add('laser');
        this.laserSound.setVolume(0.4);

        this.bullets = this.scene.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
            allowGravity: false,
        });

    }

    createAnimations() {
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('captain-idle', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('captain-run', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'punch',
            frames: this.scene.anims.generateFrameNumbers('captain-fight', { start: 1, end: 3 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'kick',
            frames: this.scene.anims.generateFrameNumbers('captain-fight', { start: 4, end: 7 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'shield',
            frames: this.scene.anims.generateFrameNumbers('captain-fight', { start: 8, end: 11 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'throw',
            frames: this.scene.anims.generateFrameNumbers('shield-throw', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'catch',
            frames: this.scene.anims.generateFrameNumbers('shield-throw', { start: 12, end: 15 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'fly',
            frames: this.scene.anims.generateFrameNumbers('shield-fly', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'whip',
            frames: this.scene.anims.generateFrameNumbers('whip', { start: 0, end: 27 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'special',
            frames: this.scene.anims.generateFrameNumbers('special', { start: 11, end: 56 }),
            frameRate: 18,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'block',
            frames: this.scene.anims.generateFrameNumbers('special', { start: 0, end: 10 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.createFromAseprite('shot');

        let fightAnimations = [
            'punch',
            'punch2',
            'kick',
            'shield',
            'fly',
            'catch',
            'burst',
            'jumpKick'
        ];

        this.on('animationcomplete', (anim, frame) => {

            if (fightAnimations.includes(anim.key)) {
                this.scene.fightEnds = true;
            }
        });


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
            this.state !== 'special' &&
            this.state !== 'burst'
        ) {
            this.anims.play('idle', true);
            this.state = 'idle';
        }
    }

    move(direction) {
        if (!this.blockedMovement) {

            this.movingDirection = direction;
            this.focusTo = direction;
            let xMovement = direction === 'left' ? -1 : 1;
            let flip = direction === 'left';
            this.setVelocityX(this.velocity * xMovement);
            if (this.state !== 'jump') {
                this.anims.play('run', true).setFlipX(flip);
                this.state = 'running';
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    throwShield() {
        this.shield = this.scene.physics.add.sprite(this.x, this.y, 'shield-fly');
        // this.shield.body.setAllowGravity(false);
        this.shield.setScale(0.6);
        this.bullets.add(this.shield);
        let distance = 150;
        this.blockedMovement = true;
        let boomerangSound = this.scene.sound.add('boomerang');
        this.scene.time.delayedCall(400, () => {
            boomerangSound.play();
        });
        this.anims.play('throw', true);
        this.state = 'throw';
        this.scene.time.delayedCall(375, () => {
            // calcula posicion del escudo desde el player
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
        });

        this.shield.on('animationcomplete-fly', (anim, frame) => {
            if (anim.key === 'fly') {
                this.scene.fightEnds = true;
            }
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
                this.anims.play('catch', true);
            }
        });

        this.on('animationcomplete-catch', (anim, frame) => {
            this.shield.destroy();
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
        this.setVelocityX(0);
        this.blockedMovement = true;
        this.blockedFight = true;
        this.fightEnds = false;
        this.anims.play('burst', true);
        this.state = 'burst';

        this.on('animationcomplete-burst', (anim, frame) => {
            this.state = 'idle';
            this.fightEnds = true;
            this.blockedMovement = false;
        });
    }

    kick() {
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
    
    punch() {
        this.blockedFight = true;
        this.fightEnds = false;
        this.anims.play('punch', true);
        this.state = 'punch';
        this.punchSound.play();
        this.on('animationcomplete-punch', (anim, frame) => {
            this.state = 'idle';
            this.fightEnds = true;
        });
    }

    punch2() {
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
        if (
            this.movingDirection !== 'up' &&
            this.movingDirection !== 'down'
        ) {
            this.blockedFight = true;
            this.fightEnds = false;
            this.anims.play('shield', true);
            this.state = 'shield';
            this.scene.time.delayedCall(100, () => {
                this.punchSound.play();
            });
            this.on('animationcomplete-shield', (anim, frame) => {
                this.scene.time.delayedCall( 200, () => {
                    this.state = 'idle';
                    this.fightEnds = true;
                });
            });
        }
    }

    handleJump() {
        this.blockedJump = true;
        this.movingDirection = 'up';
        this.setVelocityY(-400);
        this.body.setGravityY(400);
        this.anims.play('jump');

        if (this.state === 'running') {
            this.state = 'runningJump';
        } else {
            this.state = 'jump';
            this.on('animationcomplete-jump', (anim, frame) => {
                this.anims.play('idle');
            });
        }


    }

    jumpKick() {
        console.log('jumpKick', this.anims);
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
        
        this.vulnerable = false;
        let originalX = this.x;
        let originalY = this.y;
        let width = this.width;
        let height = this.height;
        let directionX = this.focusTo === 'left' ? -1 : 1;
        let flip = this.focusTo === 'left';
        
        this.state = 'special';
        this.setVisible(false);

        let special = this.scene.physics.add.sprite(originalX + 3, (originalY - height / 2) + 3, 'special');
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

        this.scene.time.delayedCall( 2300, () => {
            this.state = 'specialExplosion';
            this.body.setSize(128,64);
        });

        this.scene.time.delayedCall( 2555.55, () => {
            special.destroy();
            this.setPosition(originalX + 50 * directionX, originalY);
            this.body.setSize(width,height);
            this.setVisible(true);
            this.state = 'idle';
            this.vulnerable = true;
        });

    }

    land() {
        this.anims.play('land', true);
        this.on('animationcomplete-land', (anim, frame) => {
            this.state = 'idle';
            this.idle();
            this.movingDirection = this.focusTo;
        });
    }

    runCombo(name) {
        console.log('run combo',name);

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
}
