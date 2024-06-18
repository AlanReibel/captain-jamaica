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
}
