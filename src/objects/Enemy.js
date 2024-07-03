import { enemies } from './enemyConfig';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name) {

        super(scene, x, y, `${name}-Idle`);
        this.name = name;
        // Agregar el sprite a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.play(`${name}-Idle`);
        this.state = 'idle';
        this.invulnerable = false;
        // Establecer propiedades básicas
        this.scene = scene;
        this.health = enemies[name].health || 100;
        this.speed = enemies[name].speed || 100;
        this.focusTo = 'right';
        this.behavior = enemies[name].behavior;
        this.setCollideWorldBounds(true);

    }

    update() {
        if (this.state !== 'hurt' && this.state !== 'dying') {
            this.behavior(this.scene, this);
        }
    }

    attack() {

        if (this.state !== 'attacking') {
            this.state = 'attacking';
            if (this.turn) {
                this.anims.play(`${this.name}-Attack`, true).setFlipX(true);
            } else {
                this.anims.play(`${this.name}-Attack`, true).setFlipX(false);
            }
            this.once('animationcomplete', () => {
                this.state = 'idle';
            });
        }
    }

    hurt() {
        if (this.state !== 'hurt' && !this.invulnerable) {
            this.state = 'hurt';
            this.invulnerable = true; // Enemigo es invulnerable después de ser golpeado
            this.anims.play(`${this.name}-Hurt`, true);
            this.takeDamage(50);
            // Después de un tiempo, permite que el enemigo pueda recibir daño de nuevo
            this.once('animationcomplete', () => {
                this.invulnerable = false;
                this.state = 'idle';
            });

        }
    }

    move(direction = this.focusTo) {
        this.turn = direction !== this.focusTo;
        this.state = 'walk';
        if (direction === 'left') {
            this.setVelocityX(- this.speed);
        }
        if (direction === 'right') {
            this.setVelocityX(this.speed);
        }

        if (this.turn) {
            this.anims.play(`${this.name}-Walk`, true).setFlipX(true);
        } else {
            this.anims.play(`${this.name}-Walk`, true).setFlipX(false);
        }
    }


    stop() {
        if (this.state !== 'attacking' && this.state !== 'hurt' && this.state !== 'dying') {
            this.setVelocityX(0);
            this.state = 'idle';
            this.anims.play(`${this.name}-Idle`, true);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        if (this.state !== 'dying') {
            this.state = 'dying';
            this.anims.play(`${this.name}-Death`, true);
            this.once('animationcomplete', () => {
                this.destroy();
                console.log(`${this.name} death`);
            });
        }
    }

    static loadResources(scene) {
        for (const [enemyName, enemyData] of Object.entries(enemies)) {
            for (const [animationName, animationData] of Object.entries(enemyData.animations)) {
                scene.load.spritesheet(
                    `${enemyName}-${animationName}`,
                    `assets/sprites/enemies/${enemyName}/${animationName}.png`,
                    { frameWidth: animationData.frameWidth, frameHeight: animationData.frameHeight }
                );
            }
        }
    }

    static createAnimations(scene, enemyName) {
        for (const [animationName, animationData] of Object.entries(enemies[enemyName].animations)) {
            scene.anims.create({
                key: `${enemyName}-${animationName}`,
                frames: scene.anims.generateFrameNumbers(`${enemyName}-${animationName}`, {
                    start: 0,
                    end: animationData.frames - 1
                }),
                frameRate: animationData.frameRate,
                repeat: animationData.repeat
            });
        }
    }
}
