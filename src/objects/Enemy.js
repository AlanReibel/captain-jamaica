import { enemies } from './enemyConfig';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name) {

        super(scene, x, y, `${name}-Idle`);

        // Agregar el sprite a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.createAnimations(scene, name);
        this.anims.play(`${name}-Idle`);

        // Establecer propiedades básicas
        this.scene = scene;
        this.health = enemies[name].health || 100;
        this.speed = enemies[name].speed || 100;
        this.focusTo = 'right';
        // this.behavior = enemies[name].behavior || this.defaultBehavior();
        this.behavior = enemies[name].behavior;
        this.setCollideWorldBounds(true);


        this.moveEnemy();
        // Configurar física
        // this.setVelocity(Phaser.Math.Between(-this.speed, this.speed), Phaser.Math.Between(-this.speed, this.speed));
        console.log(`enemy ${name} created`,this);

    }

    update() {
        this.behavior(this.scene, this);
    }

    moveEnemy( direction ) {
        console.log('speed',this.speed);
        this.setVelocityX( - this.speed);

    }
    

    // Método para recibir daño
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    // Método para la muerte del enemigo
    die() {
        this.destroy();
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

    createAnimations(scene, enemyName) {
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
