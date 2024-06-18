import { ScaleModes } from "phaser";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
    
        this.setCollideWorldBounds(true);
        this.on('animationcomplete', this.animationComplete, this);
    }

    fire(x, y,direction) {

        this.bulletFlash( x, y);
        this.body.reset(x, y);
        this.body.setAllowGravity(false);
        this.setActive(true);
        this.setVisible(true);
        let directionX = direction == 'right' 
            ? 1
            : -1;
        this.setVelocityX(1000 * directionX);

    }

    update() {
        if (this.y < 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    animationComplete(animation, frame) {
        this.destroy();
    }

    bulletFlash( x, y) {
        let graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff, 1); // Color blanco, opacidad completa
        graphics.fillCircle(x, y, 15); // Círculo blanco de 50px de diámetro
        // Convertir el gráfico en una textura
        graphics.generateTexture('flash', 50, 50); // Generar una textura de 100x100
    
        // Crear un sprite para el destello en la misma posición que la bala
        let flash = this.scene.add.sprite(this.scene.player.x, this.scene.player.y, 'flash');

        // Definir una animación para el destello (opcional)
        this.scene.tweens.add({
            targets: graphics,
            x: x,
            y: y,
            // scale: { value: 0, duration: 200, ease: 'Linear' }, // Escalar el destello a 2x en 200ms
            scale: 0,
            opacity: 0,
            duration: 50,
            // alpha: { value: 0, duration: 500, ease: 'Linear' }, // Desvanecer el destello a 0 en 200ms
            // duration: 100, // Duración de la animación (milisegundos)
            onComplete: () => { graphics.destroy(); } // Destruir el destello al finalizar la animación
        });
    }
}
