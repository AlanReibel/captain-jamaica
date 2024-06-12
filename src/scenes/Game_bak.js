import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    player;
    cursors;

    score = 0;
    textScore;

    lives = 3;
    textLives;

    gameOver = false;

    map;
    movingDirection = 1;
    blockedFight = false;


    create() {
        this.gameOver = false;
        const background = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'background');

        this.add.image(400, 300, 'background');

        // player
        this.player = this.physics.add.sprite(100, 400, 'captain-idle');
        this.player.setBounce(0.2)
            .setCollideWorldBounds(true)
            .setScale(0.2);


        // define idle animation
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('captain-idle', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });

        // define run animation
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('captain-run', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });

        // define fight animations
        this.anims.create({
            key: 'punch',
            frames: this.anims.generateFrameNumbers('captain-fight', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0,
            duration: 200,
            loop: false
        });

        this.anims.create({
            key: 'kick',
            frames: this.anims.generateFrameNumbers('captain-fight', { start: 4, end: 7 }),
            frameRate: 12,
            repeat: 0,
            duration: 200,
            loop: false

        });

        this.anims.create({
            key: 'shield',
            frames: this.anims.generateFrameNumbers('captain-fight', { start: 8, end: 11 }),
            frameRate: 12,
            repeat: 0,
            duration: 200,
            loop: false
        });

        this.player.on('animationcomplete-punch', () => {
            console.log('punch animation complete');
            this.blockedFight = false;
        });

        this.player.anims.play('idle', true);

        // keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    }

    update() {

        // console.log('blockedFight',this.blockedFight);
        if (
            this.cursors.space.isUp &&
            this.qKey.isUp &&
            this.eKey.isUp
        ) {
            this.blockedFight = false;
        }
        if( this.cursors.space.isDown 
            // && !this.blockedFight
        ) {
            console.log('space.isDown');
            this.blockedFight = true;
            this.player.anims.play('shield', true); 
            // this.checkPressed(this.cursors.space);
        }

        else if (this.qKey.isDown 
            // && !this.blockedFight
        ) {
            this.blockedFight = true;
            this.player.anims.play('punch', true);
            // this.checkPressed(this.qKey);
        }

        else if (this.eKey.isDown 
            // && !this.blockedFight
        ) {
            this.player.anims.play('kick', true);
            this.blockedFight = true;
            this.checkPressed(this.eKey);
        }

        else if (this.cursors.left.isDown || this.aKey.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('run', true).setFlipX(true);
        }
        else if (this.cursors.right.isDown || this.dKey.isDown) {
            this.player.setVelocityX(200);
            this.player.anims.play('run', true).setFlipX(false);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
            // if(
            //     (this.cursors.space.isUp && this.qKey.isUp && this.qKey.isUp) &&
            //     this.blockedFight
            // ) {
            //     console.log('unblocked');
            //     this.blockedFight = false;
            // }
        }

        // console.log('is touching down', this.player.body.blocked.down);
        if ( 
            (this.cursors.up.isDown && this.player.body.blocked.down ) ||
            (this.wKey.isDown && this.player.body.blocked.down)
        ) {
            this.player.setVelocityY(-550);
            if (this.player.body.velocity.y < 0) {
                this.player.body.setGravityY(600) // Mayor gravedad durante el ascenso
              }

        }

        if (this.gameOver) {
            this.scene.start('GameOver');
        }

    }

    checkPressed (key) {
        if(key.isUp ) {
            console.log('check pressed', key);
            this.blockedFight = false;
        }
    }
}
