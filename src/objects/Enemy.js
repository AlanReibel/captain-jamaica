import { enemies } from './enemyConfig';

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    invulnerable = false;
    state = 'idle';
    focusTo = 'right';
    bulletFired = false;
    bullets;
    bulletImage;
    bulletDamage;
    startPosition;
    attackDone = false;
    movingDirectionX;
    movingDirectionY;

    constructor(scene, x, y, name) {

        super(scene, x, y, `${name}-Idle`);
        this.name = name;
        // Agregar el sprite a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.startPosition = {x: this.x, y: this.y}
        this.anims.play(`${name}-Idle`);

        // Establecer propiedades básicas
        this.scene = scene;
        this.health = enemies[name].health || 100;
        this.speed = enemies[name].speed || 100;
        this.behavior = enemies[name].behavior;
        this.bulletImage = enemies[name].bulletImage;
        this.bulletDamage = enemies[name].bulletDamage;
        this.setCollideWorldBounds(true);

        this.bullets = this.scene.physics.add.group();

        this.addSounds();

    }

    update() {
        if (this.state !== 'hurt' && this.state !== 'dying') {
            this.behavior(this.scene, this);
        }
    }

    attack() {

        if (this.state !== 'attacking') {
            this.attackDone = false;
            this.state = 'attacking';
            let flip = this.focusTo === 'left';

            if(!this.shot) {
                this.punchSound.play();
            }
            this.anims.play(`${this.name}-Attack`, true).setFlipX(flip);

            // this.once('animationcomplete', () => {
            //     this.attackDone = true;
            //     this.state = 'idle';
            // });

            this.scene.time.delayedCall(800, () => {
                this.attackDone = true;
                this.state = 'idle';
            });
        }
    }

    fire(scene) {

        if( !this.bulletFired ) {

            let directionX = this.focusTo === 'right' ? 1 : -1;
            this.bulletFired = true;
            let bullet = scene.physics.add.image(this.x, this.y, this.bulletImage);
            bullet.damage = this.bulletDamage;
            this.bullets.add(bullet);
            bullet.setVelocityX(500 * directionX);
            bullet.body.setAllowGravity(false);
            this.shotSound.play();
            scene.time.delayedCall( 800, () => {
                this.bulletFired = false;
            });
        }
    }

    hurt(damage) {

        if (this.state !== 'hurt' && !this.invulnerable) {
            this.state = 'hurt';
            this.invulnerable = true; // Enemigo es invulnerable después de ser golpeado
            this.anims.play(`${this.name}-Hurt`, true);
            this.takeDamage(damage);
            // Después de un tiempo, permite que el enemigo pueda recibir daño de nuevo
            this.once('animationcomplete', () => {
                this.invulnerable = false;
                this.state = 'idle';
            });

        }
    }

    move(direction = this.focusTo) {
        if(this.state !== 'attacking') {
            this.movingDirectionX = direction;
            this.turn = direction !== this.focusTo;
            this.focusTo = direction;
            this.state = 'walk';
            if (direction === 'left') {
                this.setVelocityX(- this.speed);
                this.anims.play(`${this.name}-Walk`, true).setFlipX(true);
    
            }
            if (direction === 'right') {
                this.setVelocityX(this.speed);
                this.anims.play(`${this.name}-Walk`, true).setFlipX(false);
    
            }
        }

    }


    stop() {
        if (this.state !== 'attacking' && this.state !== 'hurt' && this.state !== 'dying') {
            this.setVelocityX(0);
            this.state = 'idle';
            let flip = this.focusTo === 'left';
            this.anims.play(`${this.name}-Idle`, true).setFlipX(flip);
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
                this.dieSound.play();
                this.destroy();
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

        scene.load.image('ball1', 'assets/sprites/enemies/bullets/Ball1.png');
        scene.load.image('ball2', 'assets/sprites/enemies/bullets/Ball2.png');

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

    addSounds() {
        this.dieSound = this.scene.sound.add('die');
        this.punchSound = this.scene.sound.add('enemyPunch');
        this.shotSound = this.scene.sound.add('enemyShot');
        this.shotSound.setVolume(0.6);
    }
}
