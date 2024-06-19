import { Scene } from 'phaser';

export class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite
            .setBounce(0.2)
            .setCollideWorldBounds(true)
            .setScale(1.5);
        // console.log('player', this.sprite);
        this.createAnimations();
        this.sprite.anims.play('idle', true);

        this.shield = scene.physics.add.sprite(this.x, this.y, 'shield-fly');
        this.shield.body.setAllowGravity(false);
        this.shield.setScale(1.5);
        // this.shield.setSize(100, 100)
        // scene.physics.world.enable(this.shield);
        this.shield.setVisible(false);

        this.shield.on('animationcomplete-fly', (anim, frame) => {
            if (anim.key === 'fly') {
                this.scene.fightEnds = true;
            }
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

        this.sprite.on('animationcomplete', (anim, frame) => {

            if (fightAnimations.includes(anim.key)) {
                this.scene.fightEnds = true;
            }
        });


    }
}
