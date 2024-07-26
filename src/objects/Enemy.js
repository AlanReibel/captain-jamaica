import { enemies } from './enemyConfig';

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    startPosition;
    state = 'idle';
    focusTo = 'right';

    bullets;
    bulletImage;
    bulletDamage;
    bulletFired = false;

    movingDirectionX;
    movingDirectionY = 'none';

    invulnerable = false;
    shouldAttack = true;
    attackDone = false;
    attackCounter = 0;
    nextAttackWait = 2000;

    sounds = [];

    constructor(scene, x, y, name) {

        super(scene, x, y, `${name}-Idle`);
        this.name = name;
        // Agregar el sprite a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.addSounds();
        this.setBounce(0.2);
        this.body.collideWorldBounds = true;


        this.startPosition = { x: this.x, y: this.y }
        this.anims.play(`${name}-Idle`);

        // Establecer propiedades básicas
        this.scene = scene;
        this.health = enemies[name].health || 100;
        this.speed = enemies[name].speed || 100;
        this.behavior = enemies[name].behavior;
        this.bulletImage = enemies[name].bulletImage;
        this.bulletDamage = enemies[name].bulletDamage;
        this.damage = enemies[name].damage;
        this.shot = enemies[name].shot;
        this.fly = enemies[name].fly || false;

        this.bullets = this.scene.physics.add.group();
        
        this.setDepth(5);
        this.bullets.setDepth(5);

    }

    update() {
        if (this.state !== 'hurt' && this.state !== 'dying') {
            this.behavior(this.scene, this);
        }
    }

    attack() {
        if (this.state === 'attacking') {
            return;
        } else if (this.attackCounter < 2) {


            if (this.shouldAttack) {

                this.attackDone = false;
                this.shouldAttack = false;
                this.state = 'attacking';
                let flip = this.focusTo === 'left';
                this.anims.play(`${this.name}-Attack`, true).setFlipX(flip);
                if (this.name === 'weelRobot') {
                    this.attackMovement();
                }
                if (this.shot) {

                    this.scene.time.delayedCall(100, () => {
                        this.fire(this.scene);
                    });

                } else {

                    this.sounds['enemy-punch'].play();

                }

                this.scene.time.delayedCall(200, () => {
                    this.state = 'idle';
                    this.attackCounter++;
                    this.attackDone = true;
                    this.shouldAttack = true;
                    if (this.shot) {
                        this.bulletFired = false;
                    }
                });

            }

        } else {
            this.state = 'attacking';
            this.scene.time.delayedCall(this.nextAttackWait, () => {
                this.state = 'idle';
                this.attackCounter = 0;
            });
        }
    }

    attackMovement() {
        this.scene.tweens.add({
            targets: this,
            y: this.y - 20,
            ease: 'Power1',
            duration: 200,

        });
    }

    fire(scene) {
        if (!this.bulletFired) {

            let directionX = this.focusTo === 'right' ? 1 : -1;
            this.bulletFired = true;
            let bullet = scene.physics.add.image(this.x, this.y, this.bulletImage);
            bullet.damage = this.bulletDamage;
            bullet.setDepth(5);
            this.bullets.add(bullet);
            bullet.setVelocityX(500 * directionX);
            bullet.body.setAllowGravity(false);
            this.sounds['enemy-shot'].play();
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

    move(directionX = this.focusTo, directionY = 'none') {
        if (this.state !== 'attacking') {

            this.movingDirectionX = directionX;
            this.turn = directionX !== this.focusTo;
            this.focusTo = directionX;
            this.state = 'walk';

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
                        this.setVelocityY(-80);
                        this.anims.play(`${this.name}-Walk`, true).setFlipX(false);
                        break;
                    case 'down':
                        this.setVelocityY(120);
                        break;
                    case 'none':
                        this.setVelocityY(0);
                        break;

                }
            }

            // console.log('moving dir', {
            //     x: this.movingDirectionX,
            //     y: this.movingDirectionY,
            //     blocked: this
            // });
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
                this.sounds['enemy-die'].play();
                this.destroy();
            });
        }
    }

    static loadResources(scene) {
        for (const [enemyName, enemyData] of Object.entries(enemies)) {
            for (const [animationName, animationData] of Object.entries(enemyData.animations)) {
                scene.load.spritesheet(
                    `${enemyName}-${animationName}`,
                    `sprites/enemies/${enemyName}/${animationName}.png`,
                    { frameWidth: animationData.frameWidth, frameHeight: animationData.frameHeight }
                );
            }
        }

        scene.load.image('ball1', 'sprites/enemies/bullets/Ball1.png');
        scene.load.image('ball2', 'sprites/enemies/bullets/Ball2.png');

    }

    static createAnimations(scene) {

        for (const [enemyName, enemyData] of Object.entries(enemies)) {

            for (const [animationName, animationData] of Object.entries(enemyData.animations)) {
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

    addSounds() {

        let enemySounds = [
            'enemy-die',
            'enemy-shot',
            'enemy-punch',
        ];
        enemySounds.forEach(sound => {
            this.sounds[sound] = this.scene.sound.add(sound);
        });

    }
}
