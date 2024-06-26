export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, options = {}) {
        super(scene, x, y, texture);

        this.animations = [
            { 'idle': 4, 'walk': 4, 'attack': 4, 'death': 4, 'hurt': 2 }, //0
            { 'idle': 4, 'walk': 4, 'attack': 4, 'death': 4, 'hurt': 2 }, //1
            { 'idle': 4, 'walk': 4, 'attack': 4, 'death': 4, 'hurt': 2 }, //2
            { 'idle': 4, 'walk': 4, 'attack': 4, 'death': 4, 'hurt': 2 }, //3
            { 'idle': 4, 'walk': 4, 'attack': 4, 'death': 4, 'hurt': 2 }, //4
            { 'idle': 4, 'walk': 4, 'attack': 4, 'death': 4, 'hurt': 2 }  //5
        ];
        // Agregar el sprite a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Establecer propiedades básicas
        this.scene = scene;
        this.health = options.health || 100;
        this.speed = options.speed || 100;
        this.behavior = options.behavior || this.defaultBehavior;

        // Añadir animaciones si se han proporcionado
        this.addAnimations();

        // Configurar otros atributos y comportamientos
        this.setInteractive();
        this.on('pointerdown', () => {
            this.takeDamage(10);
        });

        // Configurar física
        this.setCollideWorldBounds(true);
        this.setVelocity(Phaser.Math.Between(-this.speed, this.speed), Phaser.Math.Between(-this.speed, this.speed));
    }

    // Método para añadir animaciones
    addAnimations() {
        for (let animKey in this.animations[0]) {
            this.anims.create({
                key: `${this.texture}-${animKey}`,
                frames:this.scene.anims.generateFrameNumbers('special', { start: 0, end: this.animations[0][animKey] - 1 }),
                frameRate: 12,
                // repeat: animations[animKey].repeat || -1
            });
        }
    }

    // Comportamiento predeterminado del enemigo
    defaultBehavior() {
        // Movimiento simple de izquierda a derecha
        if (this.x < 50 || this.x > this.scene.scale.width - 50) {
            this.setVelocityX(this.body.velocity.x * -1);
        }
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

    // Actualización del enemigo
    update() {
        this.behavior();
    }
}
