import { Scene } from 'phaser';

export class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setBounce(0.2).setCollideWorldBounds(true).setScale(0.2);
        this.createAnimations();
        this.sprite.anims.play('idle', true);
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

        this.sprite.on('animationcomplete', (anim, frame) => {
            if (anim.key === 'punch' || anim.key === 'kick' || anim.key === 'shield') {
                this.scene.fightEnds = true;
            }
        });
    }
}
