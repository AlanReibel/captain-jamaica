import { animals } from '../config/animalsConfig';

export class Animal extends Phaser.Physics.Arcade.Sprite {

    movingDirectionX;
    movingDirectionY;
    state = 'idle';

    constructor(scene, x, y, name, flip) {
        super(scene, x, y, `${name}-Idle`);
        this.name = name;
        this.scene = scene;

        const configData = animals[name];

        this.speed = configData.speed;
        this.behavior = configData.behavior;
        this.fly = configData.fly;
        this.width = configData.width;
        this.height = configData.height;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.2);
        this.body.collideWorldBounds = true;

        this.focusTo = flip ? 'left' : 'right';
        if(configData.offSet) {

            this.setOffset(configData.offSet.x, configData.offSet.y);
        }
        this.setFlipX(flip);
        this.setDepth(4);
        this.setOrigin(0.5);
        this.setScale(0.8);

        this.anims.play(`${name}-Idle`);

    }

    update() {
        this.behavior(this.scene, this);
    }

    move(directionX = this.focusTo, directionY = 'none') {
        this.movingDirectionX = directionX;
        switch (directionX) {
            case 'left':
                this.setVelocityX(- this.speed);
                this.anims.play(`${this.name}-Walk`, true).setFlipX(true);
                break;
            case 'right':
                this.setVelocityX(this.speed);
                this.anims.play(`${this.name}-Walk`, true).setFlipX(false);
                break;
            case 'none':
                this.setVelocityX(0);
                break;

        }

        if (this.fly) {
            this.movingDirectionY = directionY;
            switch (directionY) {
                case 'up':
                    this.setVelocityY(-this.speed);
                    break;
                case 'down':
                    this.setVelocityY(this.speed);
                    break;
                case 'none':
                    this.setVelocityY(0);
                    break;

            }
        }

    }

    stop() {
            this.setVelocityX(0);

            this.anims.play(`${this.name}-Idle`, true);
    }

    static loadResources(scene) {

        for (const [animalName, animalData] of Object.entries(animals)) {
            for (const [animationName, animationData] of Object.entries(animalData.animations)) {
                scene.load.spritesheet(
                    `${animalName}-${animationName}`,
                    `sprites/animals/${animalName}/${animationName}.png`,
                    { frameWidth: animationData.frameWidth, frameHeight: animationData.frameHeight }
                );
            }
        }

    }

    static createAnimations(scene) {
        for (const [animalName, animalData] of Object.entries(animals)) {

            for (const [animationName, animationData] of Object.entries(animalData.animations)) {
                scene.anims.create({
                    key: `${animalName}-${animationName}`,
                    frames: scene.anims.generateFrameNumbers(`${animalName}-${animationName}`, {
                        start: 0,
                        end: animationData.frames - 1
                    }),
                    frameRate: animationData.frameRate,
                    repeat: animationData.repeat
                });
            }
        }

    }
}