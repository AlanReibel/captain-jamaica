export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        // this.postFX.addBloom(0xffffff, 1, 1, 0.5, 1);
        this.setCollideWorldBounds(true);
    }

    fire(x, y,direction) {
        let directionX = direction === 'right' 
            ? 1
            : -1;
        let flip = direction === 'left';

        this.bulletFlash( x, y);
        this.body.reset(x, y);
        this.body.setAllowGravity(false);
        this.setActive(true);
        this.setVisible(true);
        this.setScale(0.5);
        this.setVelocityX(1000 * directionX);
        this.setFlipX(flip);

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
        graphics.fillStyle(0xffffff, 1); 
        graphics.fillCircle(x, y, 10); 
        graphics.postFX.addBloom(0xffffff, 1, 1, 1, 2);
    
        // graphics.postFX.addBloom();
        this.scene.tweens.add({
            targets: graphics,
            x: x,
            y: y,
            scale: 0,
            opacity: 0,
            duration: 100,
            onComplete: () => { graphics.destroy(); } 
            // Destruir el destello al finalizar la animación
        });
    }
}
